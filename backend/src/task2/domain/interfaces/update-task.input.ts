import { TaskPriority, TaskStatus } from '../entities/task.enums';

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}
