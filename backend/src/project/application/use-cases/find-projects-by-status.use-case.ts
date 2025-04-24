import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/entities/project.entity';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';

@Injectable()
export class FindProjectsByStatusUseCase {
  constructor(
     @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(status: string): Promise<Project[]> {
    const trimmed = status.trim().toLowerCase();
    return await this.projectRepo.findByStatus(trimmed as ProjectStatus);
  }
}
