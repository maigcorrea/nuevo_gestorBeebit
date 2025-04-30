import { CreateTaskStaffUseCase } from '../create-task-staff.use-case';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { StaffRepositoryPort } from 'src/staff2/domain/ports/staff.repository.port';
import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
import { MailQueueService } from 'src/infrastructure/mail/mail-queue/mail-queue.service';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaff } from 'src/tasks_staff2/domain/entities/task-staff.entity';

describe('CreateTaskStaffUseCase', () => {
  let useCase: CreateTaskStaffUseCase;
  let taskRepo: jest.Mocked<TaskRepositoryPort>;
  let staffRepo: jest.Mocked<StaffRepositoryPort>;
  let taskStaffRepo: jest.Mocked<TaskStaffRepositoryPort>;
  let mailQueue: jest.Mocked<MailQueueService>;
  let ability: AppAbility;

  beforeEach(() => {
    taskRepo = {
      findById: jest.fn(),
    } as any;

    staffRepo = {
      findById: jest.fn(),
    } as any;

    taskStaffRepo = {
      exists: jest.fn(),
      findByStaffId: jest.fn(),
      create: jest.fn(),
    } as any;

    mailQueue = {
      sendMail: jest.fn(),
    } as any;

    useCase = new CreateTaskStaffUseCase(taskRepo, staffRepo, taskStaffRepo, mailQueue);

    ability = {
      can: jest.fn().mockReturnValue(true),
    } as any;
  });

  it('crea relaciones correctamente', async () => {
    const taskId = 'task-123';
    const staffId = 'staff-456';

    taskRepo.findById.mockResolvedValue({ id: taskId, title: 'Tarea', description: 'Descripción' });
    staffRepo.findById.mockResolvedValue({ id: staffId, name: 'Juan', email: 'juan@test.com' });
    taskStaffRepo.exists.mockResolvedValue(false);
    taskStaffRepo.findByStaffId.mockResolvedValue([]);
    taskStaffRepo.create.mockImplementation((relacion) => Promise.resolve(relacion));

    const result = await useCase.execute(
      { id_task: taskId, id_staff: [staffId] },
      ability
    );

    expect(result).toHaveLength(1);
    expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
    expect(staffRepo.findById).toHaveBeenCalledWith(staffId);
    expect(taskStaffRepo.create).toHaveBeenCalled();
    expect(mailQueue.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'juan@test.com',
    }));
  });
});
