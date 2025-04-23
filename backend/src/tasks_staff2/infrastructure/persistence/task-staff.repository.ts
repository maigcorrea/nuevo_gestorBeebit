import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { TaskStaffOrmEntity } from './task-staff.orm-entity';
import { TaskStaff } from '../../domain/entities/task-staff.entity';
import { TaskStaffMapper } from '../mappers/task-staff.mapper';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class TaskStaffRepository implements TaskStaffRepositoryPort {
  constructor(
    @InjectRepository(TaskStaffOrmEntity)
    private readonly repo: Repository<TaskStaffOrmEntity>,
  ) {}

  async create(taskStaff: TaskStaff): Promise<TaskStaff> {
    const ormEntity = TaskStaffMapper.toOrmEntity(taskStaff);
    const saved = await this.repo.save(ormEntity);
    return TaskStaffMapper.toDomainEntity(saved);
  }

  async findAll(): Promise<TaskStaff[]> {
    const entities = await this.repo.find({
      relations: ['task', 'staff'], // ← Necesario si accedes a `rel.task.status`, etc.
    });
    return entities.map(TaskStaffMapper.toDomainEntity);
  }

  async findById(id: string): Promise<TaskStaff | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['task', 'staff'],
    });
    return entity ? TaskStaffMapper.toDomainEntity(entity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByTaskId(taskId: string): Promise<TaskStaff[]> {
    const entities = await this.repo.find({
      where: { task: { id: taskId } },
      relations: ['task', 'staff'],
    });
    return entities.map(TaskStaffMapper.toDomainEntity);
  }

  async findByStaffId(staffId: string): Promise<TaskStaff[]> {
    const relaciones = await this.repo.find({
      where: { staff: { id: staffId } },
      relations: ['task'], // esto carga la tarea relacionada
    });
  
    return relaciones
      .filter((rel) => rel.task.status === 'active')
      .map((rel) => TaskStaffMapper.toDomainEntity(rel));
  }

  async exists(taskId: string, staffId: string): Promise<boolean> {
    const existing = await this.repo.findOne({
      where: {
        task: { id: taskId },
        staff: { id: staffId },
      },
    });
    return !!existing;
  }


  async findWithRelations(): Promise<TaskStaffOrmEntity[]> {
    return this.repo.find({
      relations: ['task', 'staff'],
    });
  }


  async find(options: FindManyOptions<TaskStaffOrmEntity>): Promise<TaskStaffOrmEntity[]> {
    return this.repo.find(options);
  }


  async findOneByTaskAndStaff(taskId: string, staffId: string): Promise<TaskStaffOrmEntity | null> {
    return this.repo.findOne({
      where: {
        task: { id: taskId },
        staff: { id: staffId },
      },
      relations: ['task', 'staff'],
    });
  }




  async update(taskStaff: TaskStaff): Promise<TaskStaff> {
    const ormEntity = TaskStaffMapper.toOrmEntity(taskStaff);
    const updated = await this.repo.save(ormEntity);
    return TaskStaffMapper.toDomainEntity(updated);
  }
  



  async remove(taskStaff: TaskStaff): Promise<void> {
    const entity = this.repo.create({ id: taskStaff.id });
    await this.repo.remove(entity);
  }
}
