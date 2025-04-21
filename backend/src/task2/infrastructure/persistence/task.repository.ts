// src/task/infrastructure/persistence/task.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { Task } from 'src/task2/domain/entities/task.entity';
import { TaskOrmEntity } from './task.orm-entity';

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly repo: Repository<TaskOrmEntity>,
  ) {}

  async save(task: Task): Promise<Task> {
    const entity = this.repo.create({
      id: task.id,
      title: task.title,
      description: task.description,
      start_date: task.start_date,
      end_date: task.end_date,
      completed: task.completed,
      priority: task.priority,
      status: task.status,
      associated_project: { id: task.associated_project } as any,
    });

    const saved = await this.repo.save(entity);
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findAll(): Promise<Task[]> {
    const entities = await this.repo.find();
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private mapToDomain(entity: TaskOrmEntity): Task {
    return new Task(
      entity.id,
      entity.title,
      entity.description,
      entity.associated_project?.id ?? '', // en caso de relación cargada
      entity.start_date,
      entity.end_date,
      entity.completed,
      entity.priority,
      entity.status,
    );
  }
}
