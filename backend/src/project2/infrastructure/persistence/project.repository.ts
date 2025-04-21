import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeOrmEntity } from './project.typeorm.entity';
import { ProjectRepositoryPort } from 'src/project2/domain/ports/project.repository.port';
import { Project, ProjectStatus } from 'src/project2/domain/entities/project.entity';
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
    const projects = await this.ormRepo.find();
    return projects.map((project) =>
      ProjectMapper.toDomainEntity(project),
    );
  }


  async findByTitle(letter: string): Promise<Project[]> {
    const results = await this.ormRepo
      .createQueryBuilder('project')
      .where('LOWER(project.title) ILIKE LOWER(:title)', { title: `%${letter}%` })
      .getMany();
  
    return results.map(ProjectMapper.toDomainEntity);
  }
  





  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const projects = await this.ormRepo.find({
      where: { status },
    });
  
    return projects.map(ProjectMapper.toDomainEntity);
  }





  async orderByStartDateDesc(): Promise<Project[]> {
    const projects = await this.ormRepo.find({
      order: {
        start_date: 'DESC',
      },
    });
  
    return projects.map(ProjectMapper.toDomainEntity);
  }





  async orderByStartDateAsc(): Promise<Project[]> {
    const projects = await this.ormRepo.find({
      order: {
        start_date: 'ASC',
      },
    });
  
    return projects.map(ProjectMapper.toDomainEntity);
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
