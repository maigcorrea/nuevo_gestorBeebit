import { OrderProjectsByStartDateAscUseCase } from '../order-projects-by-start-date-asc.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';

describe('OrderProjectsByStartDateAscUseCase', () => {
  let useCase: OrderProjectsByStartDateAscUseCase;
  let repo: ProjectRepositoryPort;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByTitle: jest.fn(),
      findByStatus: jest.fn(),
      orderByStartDateAsc: jest.fn(),
      orderByStartDateDesc: jest.fn(),
    };

    useCase = new OrderProjectsByStartDateAscUseCase(repo);
  });

  it('debería devolver los proyectos ordenados por fecha de inicio ascendente', async () => {
    const project1 = new Project(
      'id1',
      'Proyecto antiguo',
      '...',
      new Date('2024-01-01'),
      null,
      new Date(),
      ProjectStatus.ACTIVE,
      null,
      [],
    );

    const project2 = new Project(
      'id2',
      'Proyecto reciente',
      '...',
      new Date('2025-01-01'),
      null,
      new Date(),
      ProjectStatus.PENDING,
      null,
      [],
    );

    (repo.orderByStartDateAsc as jest.Mock).mockResolvedValue([project1, project2]);

    const result = await useCase.execute();

    expect(repo.orderByStartDateAsc).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].start_date! < result[1].start_date!).toBe(true);
  });
});
