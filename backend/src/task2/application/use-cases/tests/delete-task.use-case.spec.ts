import { DeleteTaskUseCase } from '../delete-task.use-case';
import { TaskRepositoryPort } from '../../../domain/ports/task.repository.port';
import { AppAbility } from '../../../../casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskPriority, TaskStatus } from '../../../domain/enums/task.enums';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;
  let abilityMock: AppAbility;

  const mockTask: Task = new Task(
    'task-id',
    'Título',
    'Descripción',
    'project-id',
    new Date(),
    null,
    false,
    TaskPriority.MEDIUM,
    TaskStatus.PENDING,
    { id: 'project-id', last_update: new Date(), status: 'active' }
  );

  beforeEach(() => {
    taskRepo = {
      findByIdWithProject: jest.fn(),
      delete: jest.fn(),
    } as any;

    abilityMock = {
      can: jest.fn().mockReturnValue(true),
    } as unknown as AppAbility;

    useCase = new DeleteTaskUseCase(taskRepo);
  });

  it('debería borrar la tarea si el usuario tiene permisos', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(mockTask);
    taskRepo.delete.mockResolvedValue({ affected: 1 });

    const result = await useCase.execute('task-id', abilityMock);

    expect(taskRepo.delete).toHaveBeenCalledWith('task-id');
    expect(result).toEqual({ message: 'Tarea con id task-id eliminada con éxito' });
  });

  it('debería lanzar NotFoundException si la tarea no existe', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(null);

    await expect(
      useCase.execute('task-id', abilityMock)
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(mockTask);
    const forbiddenAbility = { can: () => false } as unknown as AppAbility;

    await expect(
      useCase.execute('task-id', forbiddenAbility)
    ).rejects.toThrow(ForbiddenException);
  });
});
