import { TaskStaffOrmEntity } from '../persistence/task-staff.orm-entity';
import { TaskStaff } from '../../domain/entities/task-staff.entity';
import { TaskStaffResponseDto } from '../dto/task-staff-response.dto';

export class TaskStaffMapper {
  static toDomainEntity(entity: TaskStaffOrmEntity): TaskStaff {
    return new TaskStaff(
      entity.id,
      entity.task.id,
      entity.staff.id,
    );
  }

  static toOrmEntity(domain: TaskStaff): TaskStaffOrmEntity {
    const orm = new TaskStaffOrmEntity();
    orm.id = domain.id;
    orm.task = { id: domain.taskId } as any;
    orm.staff = { id: domain.staffId } as any;
    return orm;
  }

  static toResponseDto(taskStaff: TaskStaff): TaskStaffResponseDto {
    return {
      id: taskStaff.id,
      taskId: taskStaff.taskId,
      staffId: taskStaff.staffId,
    };
  }
}
