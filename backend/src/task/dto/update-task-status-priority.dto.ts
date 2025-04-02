import { IsEnum } from 'class-validator';
import { TaskPriority } from '../entities/task.entity';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskStatusPriorityDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}