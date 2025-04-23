
import { Test, TestingModule } from '@nestjs/testing';
import { GetProjectsByUserUseCase } from './get-projects-by-user.use-case';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectStatus } from 'src/project2/domain/entities/project.entity';

describe('GetProjectsByUserUseCase', () => {
  let useCase: GetProjectsByUserUseCase;
  let repo: TaskStaffRepositoryPort;

  const mockTaskStaffRepo = {
    find: jest.fn(),
  };

  const mockAbility: AppAbility = {
    can: jest.fn(() => true),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProjectsByUserUseCase,
        {
          provide: TaskStaffRepositoryPort,
          useValue: mockTaskStaffRepo,
        },
      ],
    }).compile();

    useCase = module.get<GetProjectsByUserUseCase>(GetProjectsByUserUseCase);
    repo = module.get<TaskStaffRepositoryPort>(TaskStaffRepositoryPort);
  });

  it('debería devolver proyectos únicos de un usuario', async () => {
    const mockTasks = [
      {
        task: {
          associated_project: {
            id: '1',
            title: 'Proyecto A',
            description: 'Desc',
            start_date: new Date(),
            deadline: new Date(),
            last_update: new Date(),
            status: ProjectStatus.ACTIVE,
            document_url: 'http://doc.com/doc.pdf',
          },
        },
      },
      {
        task: {
          associated_project: {
            id: '1',
            title: 'Proyecto A',
            description: 'Desc',
            start_date: new Date(),
            deadline: new Date(),
            last_update: new Date(),
            status: ProjectStatus.ACTIVE,
            document_url: 'http://doc.com/doc.pdf',
          },
        },
      },
    ];

    mockTaskStaffRepo.find.mockResolvedValue(mockTasks);

    const result = await useCase.execute('user-id', mockAbility);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('debería lanzar NotFoundException si no hay tareas', async () => {
    mockTaskStaffRepo.find.mockResolvedValue([]);

    await expect(useCase.execute('user-id', mockAbility)).rejects.toThrow(NotFoundException);
  });

  it('debería omitir proyectos sin permiso', async () => {
    mockTaskStaffRepo.find.mockResolvedValue([
      {
        task: {
          associated_project: {
            id: '2',
            title: 'Proyecto B',
            description: 'Desc',
            start_date: new Date(),
            deadline: new Date(),
            last_update: new Date(),
            status: ProjectStatus.ACTIVE,
            document_url: '',
          },
        },
      },
    ]);

    const ability = {
      can: () => false,
    } as AppAbility;

    const result = await useCase.execute('user-id', ability);
    expect(result).toEqual([]);
  });
});