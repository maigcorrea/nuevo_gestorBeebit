import { CreateTaskUseCase } from '../create-task.use-case';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { TaskPriority, TaskStatus } from 'src/task2/domain/entities/task.enums';
import { Task } from 'src/task2/domain/entities/task.entity';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockRepo: TaskRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateTaskUseCase(mockRepo);
  });

  const mockAbility = {
    can: jest.fn().mockReturnValue(true),
  };

  const validInput = {
    title: 'Test tarea',
    description: 'Descripción de prueba',
    associated_project: '1234-uuid-proyecto',
    start_date: new Date().toISOString(),
    priority: TaskPriority.HIGH,
  };

  it('debería crear una tarea con datos válidos', async () => {
    const expectedTask = new Task(
      'uuid-tarea',
      validInput.title,
      validInput.description,
      validInput.associated_project,
      new Date(validInput.start_date),
      null,
      false,
      validInput.priority,
      TaskStatus.PENDING,
    );

    (mockRepo.save as jest.Mock).mockResolvedValue(expectedTask);

    const result = await useCase.execute(validInput, mockAbility);

    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.title).toBe(validInput.title);
    expect(result.status).toBe(TaskStatus.PENDING);
  });

  it('debería lanzar Forbidden si no tiene permisos', async () => {
    mockAbility.can.mockReturnValue(false);

    await expect(useCase.execute(validInput, mockAbility)).rejects.toThrow(ForbiddenException);
  });

  it('debería lanzar BadRequest si la fecha es anterior a hoy', async () => {
    const badInput = { ...validInput, start_date: '2000-01-01' };
    await expect(useCase.execute(badInput, mockAbility)).rejects.toThrow(BadRequestException);
  });
});
