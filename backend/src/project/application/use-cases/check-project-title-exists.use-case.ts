import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';

@Injectable()
export class CheckProjectTitleExistsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(title: string): Promise<{ exists: boolean }> {
    const exists = await this.projectRepo.existsByTitle(title);
    return { exists };
  }
}
