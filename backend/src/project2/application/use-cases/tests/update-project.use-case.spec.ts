import { UpdateProjectUseCase } from '../update-project.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { AppAbility } from '../../../../casl/casl-ability.factory';

describe('UpdateProjectUseCase', () => {
  let useCase: UpdateProjectUseCase;
  let repo: ProjectRepositoryPort;
  let ability: AppAbility;

  const project = new Project(
    'id123',
    'Título original',
    'Descripción original',
    new Date('2025-01-01'),
    new Date('2025-02-01'),
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

    // @ts-ignore
    ability = { can: jest.fn().mockReturnValue(true) };

    useCase = new UpdateProjectUseCase(repo);
  });

  it('debería actualizar un proyecto válido', async () => {
    const input = { title: 'Nuevo título' };
    (repo.findById as jest.Mock).mockResolvedValue({ ...project });
    (repo.update as jest.Mock).mockImplementation((_id, data) => Promise.resolve({ ...project, ...data }));

    const result = await useCase.execute('id123', input, ability);

    expect(repo.findById).toHaveBeenCalledWith('id123');
    expect(repo.update).toHaveBeenCalledWith('id123', expect.objectContaining({ title: 'Nuevo título' }));
    expect(result).toEqual({ message: 'Proyecto con id id123 actualizado con éxito' });
  });

  it('debería lanzar error si no existe el proyecto', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('id123', { title: 'x' }, ability)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar error si no tiene permiso', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(project);
    (ability.can as jest.Mock).mockReturnValue(false);

    await expect(useCase.execute('id123', { title: 'x' }, ability)).rejects.toThrow(ForbiddenException);
  });

  it('debería lanzar error si no se pasa ningún campo', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(project);

    await expect(useCase.execute('id123', {}, ability)).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar error si deadline < start_date', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(project);

    await expect(
      useCase.execute(
        'id123',
        {
          deadline: '2024-01-01',
          start_date: '2025-01-02',
        },
        ability,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
