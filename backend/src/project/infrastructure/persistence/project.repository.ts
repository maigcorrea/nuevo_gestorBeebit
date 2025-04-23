import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeOrmEntity } from './project.typeorm.entity';
import { ProjectRepositoryPort } from 'src/project/domain/ports/project.repository.port';
import { Project, ProjectStatus } from 'src/project/domain/entities/project.entity';
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






  async orderByDeadline(): Promise<Project[]> {
    const projects = await this.ormRepo.find({
      order: {
        deadline: 'ASC',
      },
    });
  
    return projects.map(ProjectMapper.toDomainEntity);
  }
  


  async findById(id: string): Promise<Project | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
  
    if (!entity) return null;
  
    return ProjectMapper.toDomainEntity(entity);
  }





  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }



  
  async update(id: string, updatedData: Partial<Project>): Promise<Project> {
    const ormUpdateData = ProjectMapper.toOrmPartial(updatedData);
    await this.ormRepo.update(id, ormUpdateData);

    const updatedEntity = await this.ormRepo.findOne({ where: { id } });
  
    if (!updatedEntity) {
      throw new Error('Proyecto actualizado no encontrado');
    }
  
    return ProjectMapper.toDomainEntity(updatedEntity);
  }


  

  async existsByTitle(title: string): Promise<boolean> {
    return await this.ormRepo.exist({ where: { title } });
  }


  async save(project: Project): Promise<void> {
    const entity = ProjectMapper.toOrmEntity(project);
    await this.ormRepo.save(entity);
  }
  
  
}
