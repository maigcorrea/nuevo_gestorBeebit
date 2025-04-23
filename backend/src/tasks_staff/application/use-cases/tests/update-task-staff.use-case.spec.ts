
import { UpdateTaskStaffUseCase } from '../update-task-staff.use-case';
import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { StaffRepositoryPort } from 'src/staff2/domain/ports/staff.repository.port';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaff } from 'src/tasks_staff2/domain/entities/task-staff.entity';
import { UpdateTaskStaffInput } from 'src/tasks_staff2/domain/interfaces/update-task-staff.input';

describe('UpdateTaskStaffUseCase', () => {
  let useCase: UpdateTaskStaffUseCase;
  let taskStaffRepo: jest.Mocked<TaskStaffRepositoryPort>;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;
  let staffRepo: jest.Mocked<StaffRepositoryPort>;
  let ability: AppAbility;

  beforeEach(() => {
    taskStaffRepo = {
      findOneByTaskAndStaff: jest.fn(),
      update: jest.fn(),
    } as any;

    taskRepo = {
      findById: jest.fn(),
    } as any;

    staffRepo = {
      findById: jest.fn(),
    } as any;

    ability = {
      can: jest.fn().mockReturnValue(true),
    } as any;

    useCase = new UpdateTaskStaffUseCase(taskStaffRepo, taskRepo, staffRepo);
  });

  it('debería lanzar NotFoundException si la relación no existe', async () => {
    taskStaffRepo.findOneByTaskAndStaff.mockResolvedValue(null);

    const input: UpdateTaskStaffInput = {
      old_task_id: '1',
      old_staff_id: '2',
    };

    await expect(useCase.execute(input, ability)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    taskStaffRepo.findOneByTaskAndStaff.mockResolvedValue({} as any);
    ability.can = jest.fn().mockReturnValue(false);

    const input: UpdateTaskStaffInput = {
      old_task_id: '1',
      old_staff_id: '2',
    };

    await expect(useCase.execute(input, ability)).rejects.toThrow(ForbiddenException);
  });

  it('debería actualizar la relación correctamente', async () => {
    const relacion = new TaskStaff('rel-id', 'old-task', 'old-staff');
    taskStaffRepo.findOneByTaskAndStaff.mockResolvedValue(relacion);
    taskRepo.findById.mockResolvedValue({ id: 'new-task' } as any);
    staffRepo.findById.mockResolvedValue({ id: 'new-staff' } as any);
    taskStaffRepo.update.mockResolvedValue({ ...relacion });

    const input: UpdateTaskStaffInput = {
      old_task_id: 'old-task',
      old_staff_id: 'old-staff',
      new_task_id: 'new-task',
      new_staff_id: 'new-staff',
    };

    const result = await useCase.execute(input, ability);
    expect(result).toBeDefined();
    expect(taskRepo.findById).toHaveBeenCalledWith('new-task');
    expect(staffRepo.findById).toHaveBeenCalledWith('new-staff');
    expect(taskStaffRepo.update).toHaveBeenCalled();
  });
});
