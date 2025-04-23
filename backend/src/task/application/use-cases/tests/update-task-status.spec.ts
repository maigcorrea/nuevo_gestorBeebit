import { UpdateTaskStatusUseCase } from '../update-task-status.use-case';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { ProjectRepositoryPort } from 'src/project2/domain/ports/project.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskStatus, TaskPriority } from 'src/task2/domain/enums/task.enums';
import { Task } from 'src/task2/domain/entities/task.entity';

describe('UpdateTaskStatusUseCase', () => {
  let useCase: UpdateTaskStatusUseCase;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;
  let projectRepo: jest.Mocked<ProjectRepositoryPort>;
  let abilityMock: AppAbility;

  const mockTask = new Task(
    'task-id',
    'Tarea de prueba',
    'Descripción de prueba',
    'project-id',
    new Date(),
    null,
    false,
    TaskPriority.MEDIUM,
    TaskStatus.PENDING,
    {
      id: 'project-id',
      status: 'active',
      last_update: new Date(),
    },
  );

  beforeEach(() => {
    taskRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    } as any;

    projectRepo = {
      save: jest.fn(),
    } as any;

    useCase = new UpdateTaskStatusUseCase(taskRepo, projectRepo);

    abilityMock = {
      can: jest.fn().mockReturnValue(true),
    } as unknown as AppAbility;
  });

  it('debería actualizar el estado de la tarea si tiene permisos', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(mockTask);

    taskRepo.find.mockResolvedValue([
        { ...mockTask, status: TaskStatus.COMPLETED }
    ]);
      

    const dto = { status: TaskStatus.COMPLETED };

    const result = await useCase.execute('task-id', dto, abilityMock);

    expect(taskRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      status: TaskStatus.COMPLETED,
      completed: true,
    }));

    expect(result).toEqual({ message: `Estado de la tarea actualizado a ${dto.status}` });
  });

  it('debería lanzar NotFoundException si no encuentra la tarea', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(null);


    await expect(
      useCase.execute('task-id', { status: TaskStatus.COMPLETED }, abilityMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    taskRepo.findByIdWithProject.mockResolvedValue(mockTask);


    const forbiddenAbility = { can: () => false } as unknown as AppAbility;


    await expect(
      useCase.execute('task-id', { status: TaskStatus.COMPLETED }, forbiddenAbility),
    ).rejects.toThrow(ForbiddenException);
  });
});
