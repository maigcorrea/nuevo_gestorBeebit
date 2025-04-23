import { FindAllTaskStaffUseCase } from '../find-all-task-staff.use-case';
import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
import { TaskStaffOrmEntity } from 'src/tasks_staff2/infrastructure/persistence/task-staff.orm-entity';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException } from '@nestjs/common';
import { Task } from 'src/task2/infrastructure/persistence/task.typeorm.entity';
import { StaffOrmEntity } from 'src/staff2/infrastructure/persistence/staff.orm-entity';

describe('FindAllTaskStaffUseCase', () => {
  let useCase: FindAllTaskStaffUseCase;
  let repo: jest.Mocked<TaskStaffRepositoryPort>;
  let ability: AppAbility;

  beforeEach(() => {
    repo = {
      findWithRelations: jest.fn(),
    } as any;

    useCase = new FindAllTaskStaffUseCase(repo);

    ability = {
      can: jest.fn(() => true),
    } as any;
  });

  it('debería devolver todas las relaciones con los campos mapeados', async () => {
    const mockData: TaskStaffOrmEntity[] = [
      {
        id: 'relacion-1',
        task: { id: 'task-1', title: 'Tarea A', completed: false } as Task,
        staff: { id: 'staff-1', name: 'Carlos García' } as StaffOrmEntity,
      },
      {
        id: 'relacion-2',
        task: { id: 'task-2', title: 'Tarea B', completed: true } as Task,
        staff: { id: 'staff-2', name: 'Lucía López' } as StaffOrmEntity,
      },
    ];

    repo.findWithRelations.mockResolvedValue(mockData);

    const result = await useCase.execute(ability);

    expect(result).toEqual([
      {
        id: 'relacion-1',
        taskId: 'task-1',
        staffId: 'staff-1',
        taskTitle: 'Tarea A',
        staffName: 'Carlos García',
        taskCompleted: false,
      },
      {
        id: 'relacion-2',
        taskId: 'task-2',
        staffId: 'staff-2',
        taskTitle: 'Tarea B',
        staffName: 'Lucía López',
        taskCompleted: true,
      },
    ]);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    (ability.can as jest.Mock).mockReturnValue(false);

    await expect(useCase.execute(ability)).rejects.toThrow(ForbiddenException);
  });
});
