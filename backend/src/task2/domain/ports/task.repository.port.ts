import { Task } from '../entities/task.entity';
import { TaskStatus, TaskPriority } from '../enums/task.enums';

export abstract class TaskRepositoryPort {
  abstract create(task: Task): Promise<Task>;
  abstract findAllWithProject(): Promise<Task[]>;
  abstract findAll(): Promise<Task[]>;
  abstract findById(id: string): Promise<Task | null>;
  abstract update(id: string, task: Partial<Task>): Promise<Task>;
  abstract delete(id: string): Promise<void>;

  // Métodos adicionales que podrías usar más adelante:
  abstract findByProject(projectId: string): Promise<Task[]>;
  abstract markAsCompleted(id: string): Promise<void>;
  abstract findByIdWithProject(id: string): Promise<Task | null>;
  abstract save(task: Task): Promise<void>;
}
