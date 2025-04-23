import { ProjectStatus } from '../entities/project.entity';

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  start_date?: string;
  deadline?: string;
  status?: ProjectStatus;
}
