import { TaskPriority, TaskStatus } from '../enums/task.enums';

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}
