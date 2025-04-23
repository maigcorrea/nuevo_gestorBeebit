import { Task } from "src/task/domain/entities/task.entity";

export enum ProjectStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public start_date: Date | null,
    public deadline: Date | null,
    public last_update: Date | null,
    public status: ProjectStatus,
    public document_url: string | null,
    public tasks: Task[], // relación inversa
  ) {}
}
