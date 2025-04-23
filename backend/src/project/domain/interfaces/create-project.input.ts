import { ProjectStatus } from '../entities/project.entity';

export interface CreateProjectInput {
  title: string;
  description: string;
  start_date?: string;     // opcional, se transforma a Date en el caso de uso
  deadline?: string;       // opcional, se transforma a Date en el caso de uso
  status: ProjectStatus;
}