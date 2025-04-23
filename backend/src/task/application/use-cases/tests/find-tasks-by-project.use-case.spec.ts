import { FindTasksByProjectUseCase } from '../find-tasks-by-project.use-case';
import { TaskRepositoryPort } from '../../../domain/ports/task.repository.port';
import { Task } from '../../../domain/entities/task.entity';
import { AppAbility } from '../../../../casl/casl-ability.factory';
import { TaskPriority, TaskStatus } from '../../../domain/enums/task.enums';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('FindTasksByProjectUseCase', () => {
  let useCase: FindTasksByProjectUseCase;
  let repo: jest.Mocked<TaskRepositoryPort>;
  let ability: AppAbility;

  const projectId = 'project-uuid';

  const mockTasks: Task[] = [
    new Task('1', 'Tarea 1', 'Desc 1', projectId, new Date(), null, false, TaskPriority.HIGH, TaskStatus.PENDING),
    new Task('2', 'Tarea 2', 'Desc 2', projectId, new Date(), null, false, TaskPriority.MEDIUM, TaskStatus.ACTIVE),
  ];

  beforeEach(() => {
    repo = {
      findByProject: jest.fn(),
    } as any;

    useCase = new FindTasksByProjectUseCase(repo);
  });

  it('debería lanzar NotFoundException si no hay tareas', async () => {
    repo.findByProject.mockResolvedValue([]);

    const abilityMock = { can: jest.fn().mockReturnValue(true) } as unknown as AppAbility;

    await expect(useCase.execute(projectId, abilityMock)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si ninguna tarea es visible', async () => {
    repo.findByProject.mockResolvedValue(mockTasks);

    const abilityMock = {
      can: jest.fn().mockReturnValue(false),
    } as unknown as AppAbility;

    await expect(useCase.execute(projectId, abilityMock)).rejects.toThrow(ForbiddenException);
  });

  it('debería devolver solo las tareas permitidas si existen', async () => {
    repo.findByProject.mockResolvedValue(mockTasks);

    const abilityMock = {
      can: jest.fn((action, task) => task.id === '1'),
    } as unknown as AppAbility;

    const result = await useCase.execute(projectId, abilityMock);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(repo.findByProject).toHaveBeenCalledWith(projectId);
  });
});
