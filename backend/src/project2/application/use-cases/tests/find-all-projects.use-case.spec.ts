import { FindAllProjectsUseCase } from '../find-all-projects.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { ForbiddenException } from '@nestjs/common';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';

describe('FindAllProjectsUseCase', () => {
  let useCase: FindAllProjectsUseCase;
  let repo: ProjectRepositoryPort;
  const mockAbility = {
    can: jest.fn(),
  };

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindAllProjectsUseCase(repo);
  });

  it('debería devolver todos los proyectos si tiene permiso', async () => {
    mockAbility.can.mockReturnValue(true);

    const mockProjects: Project[] = [
      new Project(
        'uuid-1',
        'Proyecto 1',
        'Descripción',
        new Date(),
        null,
        new Date(),
        ProjectStatus.ACTIVE,
        null,
        [],
      ),
      new Project(
        'uuid-2',
        'Proyecto 2',
        'Otro',
        new Date(),
        null,
        new Date(),
        ProjectStatus.PENDING,
        null,
        [],
      ),
    ];

    (repo.findAll as jest.Mock).mockResolvedValue(mockProjects);

    const result = await useCase.execute(mockAbility as any);

    expect(repo.findAll).toHaveBeenCalled();
    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Proyecto 1');
  });

  it('debería lanzar ForbiddenException si no tiene permiso', async () => {
    mockAbility.can.mockReturnValue(false);

    await expect(
      useCase.execute(mockAbility as any),
    ).rejects.toThrow(ForbiddenException);
  });
});
