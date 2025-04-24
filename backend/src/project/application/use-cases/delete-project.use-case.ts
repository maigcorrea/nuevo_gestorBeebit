import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { AppAbility } from '../../../casl/casl-ability.factory';
import { Project } from '../../domain/entities/project.entity';
import { Project as ProjectSubject } from '../../domain/entities/project.entity';// solo para CASL
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';


@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(id: string, ability: AppAbility): Promise<{ message: string }> {
    const project = await this.projectRepo.findById(id);

    if (!project) {
      throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
    }

    if (!ability.can('delete', 'Project')) {
      throw new ForbiddenException('No tienes permiso para eliminar este proyecto');
    }

    await this.projectRepo.delete(id);

    return { message: `Proyecto con id ${id} eliminado con éxito` };
  }
}
