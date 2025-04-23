import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';

@Injectable()
export class CheckProjectTitleExistsUseCase {
  constructor(private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(title: string): Promise<{ exists: boolean }> {
    const exists = await this.projectRepo.existsByTitle(title);
    return { exists };
  }
}
