import { Task } from '../entities/task.entity';

export interface TaskRepositoryPort {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByProjectId(projectId: string): Promise<Task[]>;
  findAll(): Promise<Task[]>;
  delete(id: string): Promise<void>;
  // Puedes añadir más métodos si los necesitas luego
}
