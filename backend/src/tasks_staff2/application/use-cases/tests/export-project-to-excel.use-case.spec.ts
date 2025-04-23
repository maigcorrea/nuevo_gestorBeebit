import { ExportProjectsToExcelUseCase } from './export-projects-to-excel.use-case';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaffOrmEntity } from '../../infrastructure/persistence/task-staff.orm-entity';
import { TaskTypeOrmEntity } from 'src/task2/infrastructure/persistence/task.typeorm.entity';
import { StaffOrmEntity } from 'src/staff2/infrastructure/persistence/staff.orm-entity';

describe('ExportProjectsToExcelUseCase', () => {
  let useCase: ExportProjectsToExcelUseCase;
  let mockRepo: jest.Mocked<TaskStaffRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      findTaskStaffWithProjectByProjectIds: jest.fn(),
    } as any;

    useCase = new ExportProjectsToExcelUseCase(mockRepo);
  });

  it('debería generar un archivo Excel con las relaciones válidas', async () => {
    const mockAbility = {
      can: jest.fn().mockReturnValue(true),
    } as unknown as AppAbility;

    const rel = new TaskStaffOrmEntity();
    rel.task = new TaskTypeOrmEntity();
    rel.task.title = 'Tarea 1';
    rel.task.completed = false;
    rel.task.associated_project = {
      id: '123',
      title: 'Proyecto A',
      description: 'Descripción del proyecto',
      start_date: new Date(),
      deadline: new Date(),
    } as any;

    rel.staff = new StaffOrmEntity();
    rel.staff.name = 'Empleado 1';

    mockRepo.findTaskStaffWithProjectByProjectIds.mockResolvedValue([rel]);

    const buffer = await useCase.execute(['123'], mockAbility);

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    expect(mockRepo.findTaskStaffWithProjectByProjectIds).toHaveBeenCalledWith(['123']);
  });
});
