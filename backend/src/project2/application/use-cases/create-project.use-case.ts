import { Injectable, ForbiddenException } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { CreateProjectInput } from 'src/project2/domain/interfaces/create-project.input';
import { Project } from '../../domain/entities/project.entity'; //La de dominio
import { Project as ProjectSubject } from 'src/project/entities/project.entity'; //La usada en Casl
import { AppAbility } from '../../../casl/casl-ability.factory';
import { MinioService } from '../../../minio/minio.service';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    private readonly projectRepo: ProjectRepositoryPort,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    input: CreateProjectInput,
    ability: AppAbility,
    file?: Express.Multer.File,
  ): Promise<Project> {
    if (!ability.can('create', ProjectSubject)) {
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
