import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class FindProjectsByTitleUseCase {
  constructor(private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(letter: string): Promise<Project[]> {
    return await this.projectRepo.findByTitle(letter);
  }
}
