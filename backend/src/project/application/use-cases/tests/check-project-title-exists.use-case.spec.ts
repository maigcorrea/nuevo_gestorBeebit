import { CheckProjectTitleExistsUseCase } from '../check-project-title-exists.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';

describe('CheckProjectTitleExistsUseCase', () => {
  let useCase: CheckProjectTitleExistsUseCase;
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
      existsByTitle: jest.fn(),
    };

    useCase = new CheckProjectTitleExistsUseCase(repo);
  });

  it('debería devolver { exists: true } si el título existe', async () => {
    (repo.existsByTitle as jest.Mock).mockResolvedValue(true);

    const result = await useCase.execute('Título existente');
    expect(repo.existsByTitle).toHaveBeenCalledWith('Título existente');
    expect(result).toEqual({ exists: true });
  });

  it('debería devolver { exists: false } si el título no existe', async () => {
    (repo.existsByTitle as jest.Mock).mockResolvedValue(false);

    const result = await useCase.execute('Título nuevo');
    expect(repo.existsByTitle).toHaveBeenCalledWith('Título nuevo');
    expect(result).toEqual({ exists: false });
  });
});


