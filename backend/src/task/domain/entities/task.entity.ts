import { TaskPriority, TaskStatus } from '../enums/task.enums';

export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public associated_project_id: string,
    public start_date: Date,
    public end_date: Date | null,
    public completed: boolean,
    public priority: TaskPriority,
    public status: TaskStatus,
    public clockifyTaskId: string | null,
    public associated_project?: {
      id: string;
      last_update: Date | null;
      status: string;
      deadline?: Date;
      clockifyProjectId?: string | null; 
    },
    
  ) {}
}
