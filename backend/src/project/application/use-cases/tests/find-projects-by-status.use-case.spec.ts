import { FindProjectsByStatusUseCase } from '../find-projects-by-status.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';

describe('FindProjectsByStatusUseCase', () => {
  let useCase: FindProjectsByStatusUseCase;
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
    };

    useCase = new FindProjectsByStatusUseCase(repo);
  });

  it('debería devolver los proyectos según su estado', async () => {
    const mockStatus = 'active';

    const mockProjects: Project[] = [
      new Project(
        'uuid-1',
        'Proyecto activo',
        'Descripción',
        new Date(),
        null,
        new Date(),
        ProjectStatus.ACTIVE,
        null,
        [],
      ),
    ];

    (repo.findByStatus as jest.Mock).mockResolvedValue(mockProjects);

    const result = await useCase.execute(mockStatus);

    expect(repo.findByStatus).toHaveBeenCalledWith(mockStatus);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(ProjectStatus.ACTIVE);
  });
});
