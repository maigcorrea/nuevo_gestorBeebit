import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStaffOrmEntity } from './task-staff.typeorm.entity';
import { Repository } from 'typeorm';
import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
import { TaskStaff } from 'src/tasks_staff2/domain/entities/task-staff.entity';
import { TaskStaffMapper } from '../mappers/task-staff.mapper';

@Injectable()
export class TaskStaffRepository implements TaskStaffRepositoryPort {
  constructor(
    @InjectRepository(TaskStaffOrmEntity)
    private readonly ormRepo: Repository<TaskStaffOrmEntity>,
  ) {}

  async create(taskStaff: TaskStaff): Promise<TaskStaff> {
    const entity = TaskStaffMapper.toOrmEntity(taskStaff);
    const saved = await this.ormRepo.save(entity);
    return TaskStaffMapper.toDomain(saved);
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  async findByTaskId(taskId: string): Promise<TaskStaff[]> {
    const results = await this.ormRepo.find({
      where: { task: { id: taskId } },
      relations: ['task', 'staff'],
    });

    return results.map(TaskStaffMapper.toDomain);
  }

  async findByStaffId(staffId: string): Promise<TaskStaff[]> {
    const results = await this.ormRepo.find({
      where: { staff: { id: staffId } },
      relations: ['task', 'staff'],
    });

    return results.map(TaskStaffMapper.toDomain);
  }
}
