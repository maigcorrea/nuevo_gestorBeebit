import { CreateProjectUseCase } from '../create-project.use-case';
import { ProjectRepositoryPort } from '../../../domain/ports/project.repository.port';
import { MinioService } from '../../../../minio/minio.service';
import { ForbiddenException } from '@nestjs/common';
import { Project, ProjectStatus } from '../../../domain/entities/project.entity';

describe('CreateProjectUseCase', () => {
  let useCase: CreateProjectUseCase;
  let repo: ProjectRepositoryPort;
  let minioService: MinioService;

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

    minioService = {
      upload: jest.fn(),
    } as any;

    useCase = new CreateProjectUseCase(repo, minioService);
  });

  it('debería crear un proyecto si tiene permisos', async () => {
    mockAbility.can.mockReturnValue(true);

    const input = {
      title: 'Proyecto de prueba',
      description: 'Descripción',
      status: ProjectStatus.ACTIVE,
    };

    const mockProject = new Project(
      'uuid',
      input.title,
      input.description,
      expect.any(Date),
      null,
      expect.any(Date),
      input.status,
      null,
      [],
    );

    (repo.create as jest.Mock).mockResolvedValue(mockProject);

    const result = await useCase.execute(input, mockAbility as any);

    expect(result.title).toBe(input.title);
    expect(repo.create).toHaveBeenCalled();
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    mockAbility.can.mockReturnValue(false);

    await expect(
      useCase.execute(
        {
          title: 'No permitido',
          description: '...',
          status: ProjectStatus.ACTIVE,
        },
        mockAbility as any,
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('debería subir archivo si se proporciona uno', async () => {
    mockAbility.can.mockReturnValue(true);

    const file = {
      originalname: 'documento.pdf',
    } as Express.Multer.File;

    (minioService.upload as jest.Mock).mockResolvedValue({
      url: 'http://localhost:9000/projects/doc.pdf',
      filename: 'doc.pdf',
    });

    const projectConArchivo = new Project(
      'uuid',
      'Proyecto con archivo',
      '...',
      expect.any(Date),
      null,
      expect.any(Date),
      ProjectStatus.ACTIVE,
      'http://localhost:9000/projects/doc.pdf',
      [],
    );

    (repo.create as jest.Mock).mockResolvedValue(projectConArchivo);

    const result = await useCase.execute(
      {
        title: 'Proyecto con archivo',
        description: '...',
        status: ProjectStatus.ACTIVE,
      },
      mockAbility as any,
      file,
    );

    expect(minioService.upload).toHaveBeenCalled();
    expect(result.document_url).toContain('http://localhost:9000');
  });
});
