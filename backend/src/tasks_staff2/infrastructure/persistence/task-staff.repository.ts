import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { TaskStaff } from '../../domain/entities/task-staff.entity';
import { TaskStaffOrmEntity } from './task-staff.orm-entity';

@Injectable()
export class TaskStaffRepository implements TaskStaffRepositoryPort {
  constructor(
    @InjectRepository(TaskStaffOrmEntity)
    private readonly repo: Repository<TaskStaffOrmEntity>,
  ) {}

  async create(taskStaff: TaskStaff): Promise<TaskStaff> {
    const entity = this.repo.create({
      task: { id: taskStaff.taskId } as any,
      staff: { id: taskStaff.staffId } as any,
    });

    const saved = await this.repo.save(entity);
    return this.mapToDomain(saved);
  }

  async findAll(): Promise<TaskStaff[]> {
    const entities = await this.repo.find({ relations: ['task', 'staff'] });
    return entities.map(this.mapToDomain);
  }

  async findById(id: string): Promise<TaskStaff | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['task', 'staff'],
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByTaskId(taskId: string): Promise<TaskStaff[]> {
    const entities = await this.repo.find({
      where: { task: { id: taskId } },
      relations: ['task', 'staff'],
    });
    return entities.map(this.mapToDomain);
  }

  async findByStaffId(staffId: string): Promise<TaskStaff[]> {
    const entities = await this.repo.find({
      where: { staff: { id: staffId } },
      relations: ['task', 'staff'],
    });
    return entities.map(this.mapToDomain);
  }

  async exists(taskId: string, staffId: string): Promise<boolean> {
    const result = await this.repo.findOne({
      where: {
        task: { id: taskId },
        staff: { id: staffId },
      },
    });
    return !!result;
  }

  private mapToDomain(entity: TaskStaffOrmEntity): TaskStaff {
    return new TaskStaff(
      entity.id,
      entity.task.id,
      entity.staff.id,
    );
  }
}
