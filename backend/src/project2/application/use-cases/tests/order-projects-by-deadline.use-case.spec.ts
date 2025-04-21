import { OrderProjectsByDeadlineUseCase } from '../order-projects-by-deadline.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';

describe('OrderProjectsByDeadlineUseCase', () => {
  let useCase: OrderProjectsByDeadlineUseCase;
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
      orderByDeadline: jest.fn(),
    };

    useCase = new OrderProjectsByDeadlineUseCase(repo);
  });

  it('debería devolver los proyectos ordenados por fecha de entrega ascendente', async () => {
    const project1 = new Project(
      'id1',
      'Entrega próxima',
      '...',
      new Date('2025-01-01'),
      new Date('2025-02-01'),
      new Date(),
      ProjectStatus.ACTIVE,
      null,
      [],
    );

    const project2 = new Project(
      'id2',
      'Entrega lejana',
      '...',
      new Date('2025-01-01'),
      new Date('2025-06-01'),
      new Date(),
      ProjectStatus.ACTIVE,
      null,
      [],
    );

    (repo.orderByDeadline as jest.Mock).mockResolvedValue([project1, project2]);

    const result = await useCase.execute();

    expect(repo.orderByDeadline).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].deadline! < result[1].deadline!).toBe(true);
  });
});
