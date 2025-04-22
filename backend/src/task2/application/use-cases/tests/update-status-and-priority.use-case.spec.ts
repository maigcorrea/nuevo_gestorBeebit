import { UpdateStatusAndPriorityUseCase } from '../update-status-and-priority.use-case';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { ProjectRepositoryPort } from 'src/project2/domain/ports/project.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStatus, TaskPriority } from 'src/task2/domain/enums/task.enums';
import { Task } from 'src/task2/domain/entities/task.entity';

describe('UpdateStatusAndPriorityUseCase', () => {
  let useCase: UpdateStatusAndPriorityUseCase;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;
  let projectRepo: jest.Mocked<ProjectRepositoryPort>;

  const mockTask = new Task(
    'task-id',
    'Tarea',
    'Descripción',
    'project-id',
    new Date(),
    null,
    false,
    TaskPriority.MEDIUM,
    TaskStatus.PENDING,
  );

  const mockProject = {
    id: 'project-id',
    last_update: new Date(),
    status: 'active',
    deadline: undefined,
    title: 'Proyecto',
    description: '',
    start_date: new Date(),
    document_url: '',
    tasks: [],
  };

  const abilityMock = {
    can: jest.fn().mockReturnValue(true),
  } as unknown as AppAbility;

  beforeEach(() => {
    taskRepo = {
      findByIdWithProject: jest.fn().mockResolvedValue(mockTask),
      findByProject: jest.fn().mockResolvedValue([
        { ...mockTask, status: TaskStatus.COMPLETED },
      ]),
      save: jest.fn(),
    } as any;

    projectRepo = {
      save: jest.fn(),
    } as any;

    useCase = new UpdateStatusAndPriorityUseCase(taskRepo, projectRepo);
  });

  it('debería actualizar estado y prioridad correctamente', async () => {
    const result = await useCase.execute(
      'task-id',
      TaskStatus.COMPLETED,
      TaskPriority.HIGH,
      abilityMock,
    );

    expect(taskRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      completed: true,
    }));

    expect(projectRepo.save).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    const forbiddenAbility = { can: () => false } as unknown as AppAbility;

    await expect(
      useCase.execute('task-id', TaskStatus.COMPLETED, TaskPriority.HIGH, forbiddenAbility)
    ).rejects.toThrow('No tienes permiso para modificar el estado y prioridad de esta tarea');
  });
});
