import { Injectable, ForbiddenException } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { CreateProjectInput } from 'src/project/domain/interfaces/create-project.input';
import { Project } from '../../domain/entities/project.entity'; //La de dominio
import { AppAbility } from '../../../casl/casl-ability.factory';
import { MinioService } from '../../../minio/minio.service';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    input: CreateProjectInput,
    ability: AppAbility,
    file?: Express.Multer.File,
  ): Promise<Project> {
    if (!ability.can('create', 'Project')) {
        throw new ForbiddenException('No tienes permiso para crear proyectos');
      }

    const { start_date, deadline, ...data } = input;

    let document_url: string | undefined = undefined;

    if (file) {
      const fileName = `projects/${Date.now()}-${file.originalname}`;
      const { url } = await this.minioService.upload(file, fileName);
      document_url = url;
      console.log('Documento subido:', fileName);
    }

    const project = new Project(
      crypto.randomUUID(), // o lo que uses para generar ID
      data.title,
      data.description,
      start_date ? new Date(start_date) : new Date(),
      deadline ? new Date(deadline) : null,
      new Date(), // last_update
      data.status,
      document_url ?? null,
      [],
    );

    return await this.projectRepo.create(project);
  }
}
