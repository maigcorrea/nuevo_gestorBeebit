import { Task } from '../../domain/entities/task.entity';
import { TaskTypeOrmEntity } from '../persistence/task.typeorm.entity';
import { TaskResponseDto } from '../dto/task-response.dto';

export class TaskMapper {
  // Convierte entidad TypeORM → entidad del dominio
  static toDomainEntity(entity: TaskTypeOrmEntity): Task {
    return new Task(
      entity.id,
      entity.title,
      entity.description,
      entity.associated_project.id, // solo extraemos el ID
      entity.start_date,
      entity.end_date,
      entity.completed,
      entity.priority,
      entity.status,
      entity.clockifyTaskId ?? null,
      {
        id: entity.associated_project.id,
        last_update: entity.associated_project.last_update,
        status: entity.associated_project.status,
        deadline: entity.associated_project.deadline ?? undefined
      }
    );
  }

  // Convierte entidad del dominio → entidad TypeORM
  static toOrmEntity(domain: Task): TaskTypeOrmEntity {
    const orm = new TaskTypeOrmEntity();

    orm.id = domain.id;
    orm.title = domain.title;
    orm.description = domain.description;

    // Creamos un objeto ProjectTypeOrmEntity con solo el ID (fake)
    orm.associated_project = { id: domain.associated_project_id } as any;

    orm.start_date = domain.start_date;
    orm.end_date = domain.end_date;
    orm.completed = domain.completed;
    orm.priority = domain.priority;
    orm.status = domain.status;
    orm.clockifyTaskId = domain.clockifyTaskId;

    return orm;
  }

  // Convierte entidad del dominio → DTO de respuesta
  static toResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      start_date: task.start_date,
      end_date: task.end_date,
      completed: task.completed,
      priority: task.priority,
      status: task.status,
      clockifyTaskId: task.clockifyTaskId,
    };
  }



  static toOrmPartialEntity(domain: Partial<Task>): Partial<TaskTypeOrmEntity> {
    const partial: Partial<TaskTypeOrmEntity> = {};
  
    if (domain.title !== undefined) partial.title = domain.title;
    if (domain.description !== undefined) partial.description = domain.description;
    if (domain.priority !== undefined) partial.priority = domain.priority;
    if (domain.status !== undefined) partial.status = domain.status;
    if (domain.completed !== undefined) partial.completed = domain.completed;
    if (domain.end_date !== undefined) partial.end_date = domain.end_date;
  
    return partial;
  }
}
