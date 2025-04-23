import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTypeOrmEntity } from './task.typeorm.entity';
import { TaskRepositoryPort } from 'src/task/domain/ports/task.repository.port';
import { Task } from 'src/task/domain/entities/task.entity';
import { TaskMapper } from '../mappers/task.mapper';
import { TaskStatus } from 'src/task/domain/enums/task.enums';

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
  constructor(
    @InjectRepository(TaskTypeOrmEntity)
    private readonly ormRepo: Repository<TaskTypeOrmEntity>,
  ) {}

  async create(task: Task): Promise<Task> {
    const ormEntity = this.ormRepo.create(TaskMapper.toOrmEntity(task));
    const saved = await this.ormRepo.save(ormEntity);
    return TaskMapper.toDomainEntity(saved);
  }

  async find(criteria: any): Promise<Task[]> {
    const found = await this.ormRepo.find(criteria);
    return found.map(TaskMapper.toDomainEntity);
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.ormRepo.find();
    return tasks.map(TaskMapper.toDomainEntity);
  }


  async findAllWithProject(): Promise<Task[]> {
    const entities = await this.ormRepo.find({
      relations: ['associated_project'],
    });
    return entities.map(TaskMapper.toDomainEntity);
  }



  async findById(id: string): Promise<Task | null> {
    const task = await this.ormRepo.findOne({ where: { id } });
    return task ? TaskMapper.toDomainEntity(task) : null;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const ormUpdates = TaskMapper.toOrmPartialEntity(updates); // 👈 nuevo método
  
    await this.ormRepo.update(id, ormUpdates);
  
    const updated = await this.ormRepo.findOne({ where: { id } });
    if (!updated) throw new Error('Tarea no encontrada');
  
    return TaskMapper.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const tasks = await this.ormRepo.find({
      where: {
        associated_project: { id: projectId },
      },
      relations: ['associated_project'],
    });
    return tasks.map(TaskMapper.toDomainEntity);
  }

  async markAsCompleted(id: string): Promise<void> {
    await this.ormRepo.update(id, {
      status: TaskStatus.COMPLETED,
      completed: true,
      end_date: new Date(),
    });
  }




  async findByIdWithProject(id: string): Promise<Task | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['associated_project'],
    });
  
    return entity ? TaskMapper.toDomainEntity(entity) : null;
  }




  async save(task: Task): Promise<void> {
    const entity = TaskMapper.toOrmEntity(task);
    await this.ormRepo.save(entity);
  }
  
  
}
