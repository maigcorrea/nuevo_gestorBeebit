import { TaskPriority } from '../entities/task.enums';

export interface CreateTaskInput {
  title: string;
  description?: string;
  associated_project: string;
  start_date?: string;
  priority: TaskPriority;
}
