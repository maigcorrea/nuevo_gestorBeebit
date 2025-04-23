import { FindProjectsByTitleUseCase } from '../find-projects-by-title.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';

describe('FindProjectsByTitleUseCase', () => {
  let useCase: FindProjectsByTitleUseCase;
  let repo: ProjectRepositoryPort;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByTitle: jest.fn(),
    };

    useCase = new FindProjectsByTitleUseCase(repo);
  });

  it('debería devolver los proyectos que coincidan con el título', async () => {
    const mockTitle = 'tienda';

    const mockProjects: Project[] = [
      new Project(
        'uuid-1',
        'Tienda online',
        'Descripción',
        new Date(),
        null,
        new Date(),
        ProjectStatus.ACTIVE,
        null,
        [],
      ),
    ];

    (repo.findByTitle as jest.Mock).mockResolvedValue(mockProjects);

    const result = await useCase.execute(mockTitle);

    expect(repo.findByTitle).toHaveBeenCalledWith(mockTitle);
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain('Tienda');
  });
});
