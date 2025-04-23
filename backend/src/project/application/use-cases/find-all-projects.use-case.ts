import { Injectable, ForbiddenException } from '@nestjs/common';
import { AppAbility } from '../../../casl/casl-ability.factory';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { Project } from '../../domain/entities/project.entity';
import { Project as ProjectSubject } from '../../domain/entities/project.entity'; // o ruta relativa correcta


@Injectable()
export class FindAllProjectsUseCase {
  constructor(private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(ability: AppAbility): Promise<Project[]> {
    if (!ability.can('read', 'Project')) {
      throw new ForbiddenException('No tienes permiso para ver los proyectos');
    }

    return await this.projectRepo.findAll();
  }
}
