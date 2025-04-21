import { TaskPriority, TaskStatus } from "./task.enums";

export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public associated_project: string, // lo tratamos como string (UUID del proyecto)
    public start_date: Date,
    public end_date: Date | null,
    public completed: boolean,
    public priority: TaskPriority,
    public status: TaskStatus,
  ) {}
}
