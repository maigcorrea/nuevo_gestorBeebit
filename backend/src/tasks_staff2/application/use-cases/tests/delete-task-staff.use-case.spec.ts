import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTaskStaffUseCase } from '../../application/use-cases/delete-task-staff.use-case';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { StaffRepositoryPort } from 'src/staff2/domain/ports/staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteTaskStaffDto } from '../../infrastructure/dto/delete-task-staff.dto';
import { TaskStaff } from '../../domain/entities/task-staff.entity';

describe('DeleteTaskStaffUseCase', () => {
  let useCase: DeleteTaskStaffUseCase;
  let mockTaskStaffRepo: Partial<TaskStaffRepositoryPort>;
  let ability: AppAbility;

  beforeEach(async () => {
    mockTaskStaffRepo = {
      findOneByTaskAndStaff: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskStaffUseCase,
        {
          provide: TaskStaffRepositoryPort,
          useValue: mockTaskStaffRepo,
        },
      ],
    }).compile();

    useCase = module.get<DeleteTaskStaffUseCase>(DeleteTaskStaffUseCase);

    ability = {
      can: jest.fn().mockReturnValue(true),
    } as unknown as AppAbility;
  });

  it('debería eliminar una relación si existe y se tienen permisos', async () => {
    const dto: DeleteTaskStaffDto = {
      id_task: 'task-id',
      id_staff: 'staff-id',
    };

    const fakeRel = new TaskStaff('rel-id', dto.id_task, dto.id_staff);
    (mockTaskStaffRepo.findOneByTaskAndStaff as jest.Mock).mockResolvedValue(fakeRel);

    const result = await useCase.execute(dto, ability);

    expect(result).toBe('Relación eliminada correctamente');
    expect(mockTaskStaffRepo.remove).toHaveBeenCalledWith(fakeRel);
  });

  it('debería lanzar NotFoundException si no se encuentra la relación', async () => {
    const dto: DeleteTaskStaffDto = {
      id_task: 'task-id',
      id_staff: 'staff-id',
    };

    (mockTaskStaffRepo.findOneByTaskAndStaff as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute(dto, ability)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    const dto: DeleteTaskStaffDto = {
      id_task: 'task-id',
      id_staff: 'staff-id',
    };

    const fakeRel = new TaskStaff('rel-id', dto.id_task, dto.id_staff);
    (mockTaskStaffRepo.findOneByTaskAndStaff as jest.Mock).mockResolvedValue(fakeRel);
    (ability.can as jest.Mock).mockReturnValue(false);

    await expect(useCase.execute(dto, ability)).rejects.toThrow(ForbiddenException);
  });
});