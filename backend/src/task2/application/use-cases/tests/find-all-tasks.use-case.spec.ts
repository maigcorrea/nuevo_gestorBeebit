import { FindAllTasksUseCase } from '../find-all-tasks.use-case';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { Task } from 'src/task2/domain/entities/task.entity';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskPriority, TaskStatus } from 'src/task2/domain/enums/task.enums';

describe('FindAllTasksUseCase', () => {
  let useCase: FindAllTasksUseCase;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;

  const validAbility = {
    can: jest.fn().mockReturnValue(true),
  } as unknown as AppAbility;

  const task1 = new Task(
    '1',
    'Tarea 1',
    'Descripción 1',
    '123',
    new Date(),
    null,
    false,
    TaskPriority.MEDIUM,
    TaskStatus.PENDING,
  );

  const task2 = new Task(
    '2',
    'Tarea 2',
    'Descripción 2',
    '456',
    new Date(),
    null,
    false,
    TaskPriority.HIGH,
    TaskStatus.ACTIVE,
  );

  beforeEach(() => {
    taskRepo = {
      findAllWithProject: jest.fn(),
    } as any;

    useCase = new FindAllTasksUseCase(taskRepo);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    const ability = { can: jest.fn().mockReturnValue(false) } as unknown as AppAbility;

    await expect(useCase.execute(ability)).rejects.toThrow('No tienes permiso para acceder a las tareas');
  });

  it('debería devolver todas las tareas si tiene permisos', async () => {
    taskRepo.findAllWithProject.mockResolvedValue([task1, task2]);

    const result = await useCase.execute(validAbility);

    expect(result).toEqual([task1, task2]);
    expect(taskRepo.findAllWithProject).toHaveBeenCalled();
  });
});
