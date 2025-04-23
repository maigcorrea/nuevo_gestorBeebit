import { IsEnum } from 'class-validator';
import { TaskPriority } from 'src/task/domain/enums/task.enums';
import { TaskStatus } from 'src/task/domain/enums/task.enums';
import { UpdateTaskStatusInput } from '../../domain/interfaces/update-task-status.input';

export class UpdateTaskStatusPriorityDto implements UpdateTaskStatusInput{
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}