import { TaskStaff } from '../entities/task-staff.entity';
import { TaskStaffOrmEntity } from 'src/tasks_staff2/infrastructure/persistence/task-staff.orm-entity';

export abstract class TaskStaffRepositoryPort {
  abstract create(taskStaff: TaskStaff): Promise<TaskStaff>;
  abstract findAll(): Promise<TaskStaff[]>;
  abstract findById(id: string): Promise<TaskStaff | null>;
  abstract delete(id: string): Promise<void>;
  
  // Extra: Métodos específicos para tu lógica de negocio
  abstract findByTaskId(taskId: string): Promise<TaskStaff[]>;
  abstract findByStaffId(staffId: string): Promise<TaskStaff[]>;
  abstract exists(taskId: string, staffId: string): Promise<boolean>;
  abstract findWithRelations(): Promise<TaskStaffOrmEntity[]>;
}
