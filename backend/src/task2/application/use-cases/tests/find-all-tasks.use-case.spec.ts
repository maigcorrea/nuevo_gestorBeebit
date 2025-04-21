import { FindAllTasksUseCase } from '../find-all-tasks.use-case';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { Task } from 'src/task2/domain/entities/task.entity';
import { TaskPriority, TaskStatus } from 'src/task2/domain/entities/task.enums';
import { ForbiddenException } from '@nestjs/common';

describe('FindAllTasksUseCase', () => {
  let useCase: FindAllTasksUseCase;
  let mockRepo: TaskRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindAllTasksUseCase(mockRepo);
  });

  const mockAbility = {
    can: jest.fn().mockReturnValue(true),
  };

  it('debería devolver todas las tareas si tiene permiso', async () => {
    const mockTasks: Task[] = [
      new Task(
        'uuid1',
        'Tarea 1',
        'Descripción 1',
        'proyecto-uuid',
        new Date(),
        null,
        false,
        TaskPriority.MEDIUM,
        TaskStatus.PENDING
      ),
      new Task(
        'uuid2',
        'Tarea 2',
        'Descripción 2',
        'proyecto-uuid',
        new Date(),
        null,
        false,
        TaskPriority.HIGH,
        TaskStatus.ACTIVE
      ),
    ];

    (mockRepo.findAll as jest.Mock).mockResolvedValue(mockTasks);

    const result = await useCase.execute(mockAbility);

    expect(result).toEqual(mockTasks);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it('debería lanzar ForbiddenException si no tiene permiso', async () => {
    mockAbility.can.mockReturnValue(false);

    await expect(useCase.execute(mockAbility)).rejects.toThrow(ForbiddenException);
  });
});
