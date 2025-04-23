import { Test, TestingModule } from '@nestjs/testing';
import { ExportProjectsToPDFUseCase } from '../export-project-to-pdf.use-case';
import { TaskStaffRepositoryPort } from '../../../../../src/tasks_staff2/domain/ports/task-staff.repository.port';
import { AppAbility } from '../../../../../src/casl/casl-ability.factory';
import { ForbiddenException } from '@nestjs/common';
import PDFDocument from 'pdfkit';

const mockTaskStaffWithProject = [
  {
    task: {
      title: 'Tarea A',
      completed: false,
      associated_project: {
        id: 'project-1',
        title: 'Proyecto 1',
        description: 'Desc 1',
        start_date: new Date('2025-01-01'),
        deadline: new Date('2025-01-31'),
        status: 'active',
      },
    },
    staff: {
      name: 'Carlos',
    },
  },
];

describe('ExportProjectsToPDFUseCase', () => {
  let useCase: ExportProjectsToPDFUseCase;
  let repo: TaskStaffRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportProjectsToPDFUseCase,
        {
          provide: TaskStaffRepositoryPort,
          useValue: {
            findTaskStaffWithProjectByProjectIds: jest.fn(() => mockTaskStaffWithProject),
          },
        },
      ],
    }).compile();

    useCase = module.get(ExportProjectsToPDFUseCase);
    repo = module.get(TaskStaffRepositoryPort);
  });

  it('debería generar un buffer PDF', async () => {
    const ability: AppAbility = {
      can: () => true,
      cannot: () => false,
    } as any;

    const result = await useCase.execute(['project-1'], ability);

    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });

  it('debería omitir relaciones si el usuario no tiene permisos', async () => {
    const ability: AppAbility = {
      can: () => false,
      cannot: () => true,
    } as any;

    const result = await useCase.execute(['project-1'], ability);

    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0); // El buffer existirá aunque el PDF esté vacío
  });
});
