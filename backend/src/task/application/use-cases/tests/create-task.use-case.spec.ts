import { CreateTaskUseCase } from '../create-task.use-case';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { CreateTaskInput } from 'src/task2/domain/interfaces/create-task.input';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { Task } from 'src/task2/domain/entities/task.entity';
import { TaskPriority, TaskStatus } from 'src/task2/domain/enums/task.enums';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let repo: TaskRepositoryPort;

  const mockRepo: TaskRepositoryPort = {
    create: jest.fn(),
    // otros métodos si se necesitan
  } as any;

  beforeEach(() => {
    useCase = new CreateTaskUseCase(mockRepo);
  });

  const validAbility = {
    can: jest.fn().mockReturnValue(true),
  } as unknown as AppAbility;

  const input: CreateTaskInput = {
    title: 'Tarea de prueba',
    description: 'Descripción',
    associated_project_id: '123',
    start_date: new Date(Date.now() + 86400000).toISOString(), // mañana
    priority: 'high',
  };

  it('debería crear la tarea correctamente si tiene permisos', async () => {
    const expectedTask = new Task(
      expect.any(String),
      input.title,
      input.description,
      input.associated_project_id,
      expect.any(Date),
      null,
      false,
      TaskPriority.HIGH,
      TaskStatus.PENDING,
    );

    (mockRepo.create as jest.Mock).mockResolvedValue(expectedTask);

    const result = await useCase.execute(input, validAbility);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ title: input.title }));
    expect(result).toEqual(expectedTask);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    const noAbility = {
      can: jest.fn().mockReturnValue(false),
    } as unknown as AppAbility;

    await expect(useCase.execute(input, noAbility)).rejects.toThrow(ForbiddenException);
  });

  it('debería lanzar BadRequestException si la fecha es anterior a hoy', async () => {
    const invalidInput = {
      ...input,
      start_date: new Date(Date.now() - 86400000).toISOString(), // ayer
    };

    await expect(useCase.execute(invalidInput, validAbility)).rejects.toThrow(BadRequestException);
  });
});
