
import { FindTasksByProjectUseCase } from '../find-tasks-by-project.use-case';
import { TaskRepositoryPort } from '../../../domain/ports/task.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Task } from 'src/task2/domain/entities/task.entity';
import { TaskPriority, TaskStatus } from 'src/task2/domain/entities/task.enums';

describe('FindTasksByProjectUseCase', () => {
  let useCase: FindTasksByProjectUseCase;
  let taskRepo: TaskRepositoryPort;

  const mockAbility = {
    can: jest.fn(() => true),
  } as unknown as AppAbility;

  const mockTask: Task = new Task(
    '1',
    'Tarea 1',
    'Descripción',
    'project-123',
    new Date(),
    null,
    false,
    TaskPriority.HIGH,
    TaskStatus.PENDING
  );

  beforeEach(() => {
    taskRepo = {
      findByProjectId: jest.fn(),
    } as unknown as TaskRepositoryPort;

    useCase = new FindTasksByProjectUseCase(taskRepo);
  });

  it('debería devolver las tareas si existen y el usuario tiene permiso', async () => {
    jest.spyOn(taskRepo, 'findByProjectId').mockResolvedValue([mockTask]);

    const result = await useCase.execute('project-123', mockAbility);

    expect(result).toEqual([mockTask]);
    expect(taskRepo.findByProjectId).toHaveBeenCalledWith('project-123');
  });

  it('debería lanzar NotFoundException si no hay tareas para ese proyecto', async () => {
    jest.spyOn(taskRepo, 'findByProjectId').mockResolvedValue([]);

    await expect(useCase.execute('project-123', mockAbility)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si el usuario no tiene permisos para ninguna tarea', async () => {
    const mockAbilityDenied = {
      can: jest.fn(() => false),
    } as unknown as AppAbility;

    jest.spyOn(taskRepo, 'findByProjectId').mockResolvedValue([mockTask]);

    await expect(useCase.execute('project-123', mockAbilityDenied)).rejects.toThrow(ForbiddenException);
  });
});