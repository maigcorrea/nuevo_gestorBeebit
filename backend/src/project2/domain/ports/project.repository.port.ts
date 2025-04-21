import { Project, ProjectStatus } from '../entities/project.entity';

export abstract class ProjectRepositoryPort {
  abstract create(project: Project): Promise<Project>;
  abstract findAll(): Promise<Project[]>;
  abstract findById(id: string): Promise<Project | null>;
  abstract update(id: string, project: Partial<Project>): Promise<Project>;
  abstract delete(id: string): Promise<void>;
  abstract findByTitle(letter: string): Promise<Project[]>;
  abstract findByStatus(status: ProjectStatus): Promise<Project[]>;
  abstract orderByStartDateDesc(): Promise<Project[]>;
  abstract orderByStartDateAsc(): Promise<Project[]>;
  abstract orderByDeadline(): Promise<Project[]>;
  abstract existsByTitle(title: string): Promise<boolean>;
}
