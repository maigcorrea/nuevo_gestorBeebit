import { TaskStaff } from 'src/tasks_staff2/domain/entities/task-staff.entity';
import { TaskStaffOrmEntity } from '../persistence/task-staff.typeorm.entity';
import { CreateTaskStaffDto } from '../dto/create-task-staff-dto';
import { CreateTaskStaffInput } from 'src/tasks_staff2/domain/interfaces/create-task-staff.input';

export class TaskStaffMapper {
  static toDomain(entity: TaskStaffOrmEntity): TaskStaff {
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

  static toCreateInput(dto: CreateTaskStaffDto): CreateTaskStaffInput {
    return new CreateTaskStaffInput(dto.id_task, dto.id_staff);
  }
}
