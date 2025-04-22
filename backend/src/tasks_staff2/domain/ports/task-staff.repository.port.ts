import { TaskStaff } from '../entities/task-staff.entity';

export interface TaskStaffRepositoryPort {
  create(taskStaff: TaskStaff): Promise<TaskStaff>;
  deleteById(id: string): Promise<void>;
  findByTaskId(taskId: string): Promise<TaskStaff[]>;
  findByStaffId(staffId: string): Promise<TaskStaff[]>;
}
