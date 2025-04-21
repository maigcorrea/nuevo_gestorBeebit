import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeOrmEntity } from './project.typeorm.entity';
import { ProjectRepositoryPort } from 'src/project2/domain/ports/project.repository.port';
import { Project } from 'src/project2/domain/entities/project.entity';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class ProjectRepository implements ProjectRepositoryPort {
  constructor(
    @InjectRepository(ProjectTypeOrmEntity)
    private readonly ormRepo: Repository<ProjectTypeOrmEntity>,
  ) {}

  async create(project: Project): Promise<Project> {
    const ormEntity = this.ormRepo.create(ProjectMapper.toOrmEntity(project));
    const saved = await this.ormRepo.save(ormEntity);
    return ProjectMapper.toDomainEntity(saved);
  }

  // Métodos que implementarás más adelante:
  // async findAll(): Promise<Project[]> { ... }
  // async findById(id: string): Promise<Project | null> { ... }
  // async update(...) { ... }
  // async delete(...) { ... }
  async findAll(): Promise<Project[]> {
    throw new Error('Method not implemented.');
  }
  
  async findById(id: string): Promise<Project | null> {
    throw new Error('Method not implemented.');
  }
  
  async update(id: string, updates: Partial<Project>): Promise<Project> {
    throw new Error('Method not implemented.');
  }
  
  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
