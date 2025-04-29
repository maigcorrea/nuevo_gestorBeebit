import { Injectable, ForbiddenException } from '@nestjs/common';
import { AppAbility } from '../../../casl/casl-ability.factory';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { Project } from '../../domain/entities/project.entity';
import { Project as ProjectSubject } from '../../domain/entities/project.entity'; // o ruta relativa correcta
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';
import { ProjectTypeOrmEntity } from 'src/project/infrastructure/persistence/project.typeorm.entity';


@Injectable()
export class FindAllProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(ability: AppAbility): Promise<Project[]> {
    if (!ability.can('read', ProjectTypeOrmEntity)) {
      throw new ForbiddenException('No tienes permiso para ver los proyectos');
    }

    return await this.projectRepo.findAll();
  }
}
