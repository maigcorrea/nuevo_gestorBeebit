import { UpdateTaskUseCase } from '../update-task.use-case';
import { TaskRepositoryPort } from '../../../domain/ports/task.repository.port';
import { ProjectRepositoryPort } from '../../../../project2/domain/ports/project.repository.port';
import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Task } from '../../../domain/entities/task.entity';
import { Project } from '../../../../project2/domain/entities/project.entity';
import { TaskPriority, TaskStatus } from '../../../domain/enums/task.enums';
import { ProjectStatus } from '../../../../project2/domain/entities/project.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;
  let projectRepo: jest.Mocked<ProjectRepositoryPort>;

  const mockTask: Task = new Task(
    'task-id',
    'Título original',
    'Descripción original',
    'project-id',
    new Date(),
    null,
    false,
    TaskPriority.MEDIUM,
    TaskStatus.PENDING,
    {
      id: 'project-id',
      last_update: new Date(),
      status: ProjectStatus.ACTIVE,
      deadline: new Date(),
    }
  );

  const abilityMock = {
    can: jest.fn().mockReturnValue(true),
  } as unknown as AppAbility;

  beforeEach(() => {
    taskRepo = {
      findByIdWithProject: jest.fn(),
      save: jest.fn(),
      findByProject: jest.fn(),
    } as any;

    projectRepo = {
      save: jest.fn(),
    } as any;

    useCase = new UpdateTaskUseCase(taskRepo, projectRepo);
  });

  it('debería lanzar NotFoundException si la tarea no existe', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(null);

    await expect(
      useCase.execute('task-id', { title: 'Nuevo título' }, abilityMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(mockTask);

    const forbiddenAbility = { can: () => false } as unknown as AppAbility;

    await expect(
      useCase.execute('task-id', { title: 'Nuevo título' }, forbiddenAbility),
    ).rejects.toThrow(ForbiddenException);
  });

  it('debería actualizar la tarea y el proyecto si todo está bien', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(mockTask);
    taskRepo.findByProject.mockResolvedValue([
      { ...mockTask, status: TaskStatus.COMPLETED },
    ]);

    const result = await useCase.execute(
      'task-id',
      { status: TaskStatus.COMPLETED },
      abilityMock,
    );

    expect(taskRepo.save).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
    expect(projectRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      status: ProjectStatus.COMPLETED,
    }));
    expect(result.message).toContain('actualizada con éxito');
  });
});
