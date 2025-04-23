
import { Test, TestingModule } from '@nestjs/testing';
import { GetTasksByUserUseCase } from '../get-tasks-by-user.use-case';
import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('GetTasksByUserUseCase', () => {
  let useCase: GetTasksByUserUseCase;
  let taskStaffRepo: jest.Mocked<TaskStaffRepositoryPort>;
  let abilityMock: AppAbility;

  beforeEach(async () => {
    taskStaffRepo = {
      find: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTasksByUserUseCase,
        {
          provide: TaskStaffRepositoryPort,
          useValue: taskStaffRepo,
        },
      ],
    }).compile();

    useCase = module.get<GetTasksByUserUseCase>(GetTasksByUserUseCase);

    abilityMock = {
      can: jest.fn().mockReturnValue(true),
    } as any;
  });

  it('debería devolver tareas si el usuario tiene permisos', async () => {
    const mockTask = {
      id: '1',
      title: 'Tarea de prueba',
      description: 'Descripción',
      start_date: new Date(),
      end_date: null,
      status: 'active',
      completed: false,
      priority: 'alta',
      associated_project: { id: '2', title: 'Proyecto A' },
    };

    taskStaffRepo.find.mockResolvedValue([{ task: mockTask } as any]);

    const result = await useCase.execute('usuario-id', abilityMock);

    expect(result).toEqual([
      {
        id: '1',
        title: 'Tarea de prueba',
        description: 'Descripción',
        start_date: expect.any(Date),
        end_date: null,
        status: 'active',
        completed: false,
        priority: 'alta',
        associated_project: { id: '2', name: 'Proyecto A' },
      },
    ]);
  });

  it('debería lanzar NotFoundException si no se encuentran tareas', async () => {
    taskStaffRepo.find.mockResolvedValue([]);
    await expect(useCase.execute('id', abilityMock)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    taskStaffRepo.find.mockResolvedValue([{ task: { id: 'x' } } as any]);
    abilityMock.can = jest.fn().mockReturnValue(false);
    await expect(useCase.execute('id', abilityMock)).rejects.toThrow(ForbiddenException);
  });
});