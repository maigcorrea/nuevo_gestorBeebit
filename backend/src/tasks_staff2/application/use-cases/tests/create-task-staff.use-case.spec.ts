import { CreateTaskStaffUseCase } from '../create-task-staff.use-case';
import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { StaffRepositoryPort } from 'src/staff2/domain/ports/staff.repository.port';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { CreateTaskStaffInput } from 'src/tasks_staff2/domain/interfaces/create-task-staff.input';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Task } from 'src/task2/domain/entities/task.entity';
import { Staff } from 'src/staff2/domain/entities/staff.entity';
import { TaskStatus, TaskPriority } from 'src/task2/domain/enums/task.enums';
import { StaffType } from 'src/staff2/domain/entities/staff.entity';

describe('CreateTaskStaffUseCase', () => {
  let useCase: CreateTaskStaffUseCase;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;
  let staffRepo: jest.Mocked<StaffRepositoryPort>;
  let taskStaffRepo: jest.Mocked<TaskStaffRepositoryPort>;
  let mailQueueService: jest.Mocked<MailQueueService>;

  const mockAbility = {
    can: jest.fn().mockReturnValue(true),
  } as unknown as AppAbility;

  beforeEach(() => {
    taskRepo = {
      findById: jest.fn(),
    } as any;

    staffRepo = {
      findById: jest.fn(),
    } as any;

    taskStaffRepo = {
      findByTaskId: jest.fn(),
      findByStaffId: jest.fn(),
      create: jest.fn(),
    } as any;

    mailQueueService = {
      sendMail: jest.fn(),
    } as any;

    useCase = new CreateTaskStaffUseCase(
      taskRepo,
      staffRepo,
      taskStaffRepo,
      mailQueueService,
    );
  });

  it('debería lanzar ForbiddenException si el usuario no tiene permiso', async () => {
    mockAbility.can = jest.fn().mockReturnValue(false);

    await expect(
      useCase.execute(
        new CreateTaskStaffInput('task-id', ['staff-id']),
        mockAbility,
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('debería lanzar NotFoundException si no encuentra la tarea', async () => {
    taskRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(
        new CreateTaskStaffInput('task-id', ['staff-id']),
        mockAbility,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería crear relaciones y enviar correos si todo va bien', async () => {
    const mockTask = new Task(
        'task-id',
        'Tarea',
        'desc',
        'project-id',
        new Date(),
        null,
        false,
        TaskPriority.HIGH,
        TaskStatus.ACTIVE
    );
    const mockStaff = new Staff(
        'staff-id',
        'Test',
        'email@test.com',
        '123',
        'pass',
        new Date(),
        StaffType.USER, // ✅
        null,
        null,
        null
      );

    taskRepo.findById.mockResolvedValue(mockTask);
    staffRepo.findById.mockResolvedValue(mockStaff);
    taskStaffRepo.findByTaskId.mockResolvedValue([]);
    taskStaffRepo.findByStaffId.mockResolvedValue([]);
    taskStaffRepo.create.mockImplementation((r) => Promise.resolve(r));

    const result = await useCase.execute(
      new CreateTaskStaffInput('task-id', ['staff-id']),
      mockAbility,
    );

    expect(result).toHaveLength(1);
    expect(taskStaffRepo.create).toHaveBeenCalled();
    expect(mailQueueService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockStaff.email,
        subject: expect.stringContaining(mockTask.title),
      }),
    );
  });
});
