
import { FindTaskStaffGroupedByTaskUseCase } from '../find-grouped-by-task.use-case';
import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException } from '@nestjs/common';
import { TaskStaffOrmEntity } from 'src/tasks_staff2/infrastructure/persistence/task-staff.orm-entity';
import { Task } from 'src/task2/infrastructure/persistence/task.typeorm.entity';
import { StaffOrmEntity } from 'src/staff2/infrastructure/persistence/staff.orm-entity';

describe('FindTaskStaffGroupedByTaskUseCase', () => {
  let useCase: FindTaskStaffGroupedByTaskUseCase;
  let repo: jest.Mocked<TaskStaffRepositoryPort>;
  let ability: AppAbility;

  beforeEach(() => {
    repo = {
      findWithRelations: jest.fn(),
    } as any;

    useCase = new FindTaskStaffGroupedByTaskUseCase(repo);

    ability = {
      can: jest.fn(() => true),
    } as any;
  });

  it('debería agrupar empleados por tarea correctamente', async () => {
    const mockData: TaskStaffOrmEntity[] = [
      {
        id: 'rel-1',
        task: { id: 'task-1', title: 'Tarea A' } as Task,
        staff: { id: 'staff-1', name: 'Carlos' } as StaffOrmEntity,
      },
      {
        id: 'rel-2',
        task: { id: 'task-1', title: 'Tarea A' } as Task,
        staff: { id: 'staff-2', name: 'Lucía' } as StaffOrmEntity,
      },
      {
        id: 'rel-3',
        task: { id: 'task-2', title: 'Tarea B' } as Task,
        staff: { id: 'staff-3', name: 'Pepe' } as StaffOrmEntity,
      },
    ];

    repo.findWithRelations.mockResolvedValue(mockData);

    const result = await useCase.execute(ability);

    expect(result).toEqual([
      {
        taskId: 'task-1',
        taskTitle: 'Tarea A',
        staff: [
          { id: 'staff-1', name: 'Carlos' },
          { id: 'staff-2', name: 'Lucía' },
        ],
      },
      {
        taskId: 'task-2',
        taskTitle: 'Tarea B',
        staff: [{ id: 'staff-3', name: 'Pepe' }],
      },
    ]);
  });

  it('debería lanzar ForbiddenException si el usuario no tiene permiso', async () => {
    (ability.can as jest.Mock).mockReturnValue(false);

    await expect(useCase.execute(ability)).rejects.toThrow(ForbiddenException);
  });
});
