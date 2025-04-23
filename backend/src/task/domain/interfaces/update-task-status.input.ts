import { TaskStatus } from '../enums/task.enums';

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}
