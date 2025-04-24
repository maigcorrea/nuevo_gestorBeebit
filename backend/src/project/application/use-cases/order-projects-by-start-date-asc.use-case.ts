import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { Project } from '../../domain/entities/project.entity';
import { Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';

@Injectable()
export class OrderProjectsByStartDateAscUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepo.orderByStartDateAsc();
  }
}
