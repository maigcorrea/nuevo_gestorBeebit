import { DeleteProjectUseCase } from '../delete-project.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppAbility } from '../../../../casl/casl-ability.factory';

describe('DeleteProjectUseCase', () => {
  let useCase: DeleteProjectUseCase;
  let repo: ProjectRepositoryPort;
  let ability: AppAbility;

  const mockProject = new Project(
    'id123',
    'Proyecto a eliminar',
    'Descripción',
    new Date(),
    new Date(),
    new Date(),
    ProjectStatus.ACTIVE,
    null,
    [],
  );

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

    // @ts-ignore ignoramos las validaciones para testear con mock
    ability = {
      can: jest.fn().mockReturnValue(true),
    };

    useCase = new DeleteProjectUseCase(repo);
  });

  it('debería eliminar el proyecto si existe y tiene permiso', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(mockProject);
    (repo.delete as jest.Mock).mockResolvedValue(undefined);

    const result = await useCase.execute('id123', ability);

    expect(repo.findById).toHaveBeenCalledWith('id123');
    expect(repo.delete).toHaveBeenCalledWith('id123');
    expect(result).toEqual({ message: 'Proyecto con id id123 eliminado con éxito' });
  });

  it('debería lanzar NotFoundException si el proyecto no existe', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('noexiste', ability)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permiso para eliminar', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(mockProject);
    (ability.can as jest.Mock).mockReturnValue(false);

    await expect(useCase.execute('id123', ability)).rejects.toThrow(ForbiddenException);
  });
});
