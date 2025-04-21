import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class OrderProjectsByStartDateAscUseCase {
  constructor(private readonly projectRepo: ProjectRepositoryPort) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepo.orderByStartDateAsc();
  }
}
