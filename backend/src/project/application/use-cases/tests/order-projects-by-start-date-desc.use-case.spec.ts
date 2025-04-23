import { OrderProjectsByStartDateDescUseCase } from '../order-projects-by-start-date-desc.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';

describe('OrderProjectsByStartDateDescUseCase', () => {
  let useCase: OrderProjectsByStartDateDescUseCase;
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
      orderByStartDateDesc: jest.fn(),
    };

    useCase = new OrderProjectsByStartDateDescUseCase(repo);
  });

  it('debería devolver los proyectos ordenados por fecha de inicio descendente', async () => {
    const project1 = new Project(
      'id1',
      'Proyecto más reciente',
      '...',
      new Date('2025-04-01'),
      null,
      new Date(),
      ProjectStatus.ACTIVE,
      null,
      [],
    );

    const project2 = new Project(
      'id2',
      'Proyecto más antiguo',
      '...',
      new Date('2025-01-01'),
      null,
      new Date(),
      ProjectStatus.PENDING,
      null,
      [],
    );

    (repo.orderByStartDateDesc as jest.Mock).mockResolvedValue([project1, project2]);

    const result = await useCase.execute();

    expect(repo.orderByStartDateDesc).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].start_date! > result[1].start_date!).toBe(true);
  });
});
