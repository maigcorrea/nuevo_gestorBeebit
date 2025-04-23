import { Project, ProjectStatus } from '../../domain/entities/project.entity';
import { ProjectTypeOrmEntity } from '../persistence/project.typeorm.entity';
import { ProjectResponseDto } from '../dto/project-response.dto';

export class ProjectMapper {
  static toDomainEntity(entity: ProjectTypeOrmEntity): Project {
    return new Project(
      entity.id,
      entity.title,
      entity.description,
      entity.start_date,
      entity.deadline,
      entity.last_update,
      entity.status,
      entity.document_url,
      [], // en esta fase no cargamos tareas; se puede extender después
    );
  }

  static toOrmEntity(domain: Project): ProjectTypeOrmEntity {
    const orm = new ProjectTypeOrmEntity();
    orm.id = domain.id;
    orm.title = domain.title;
    orm.description = domain.description;
    orm.start_date = domain.start_date;
    orm.deadline = domain.deadline;
    orm.last_update = domain.last_update;
    orm.status = domain.status;
    orm.document_url = domain.document_url;
    // tareas omitidas por ahora
    return orm;
  }

  static toResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      start_date: project.start_date,
      deadline: project.deadline,
      last_update: project.last_update,
      status: project.status,
      document_url: project.document_url ?? undefined,
    };
  }


  // Para actualizaciones parciales
  static toOrmPartial(project: Partial<Project>): Partial<ProjectTypeOrmEntity> {
    const result: Partial<ProjectTypeOrmEntity> = {};
    if (project.title !== undefined) result.title = project.title;
    if (project.description !== undefined) result.description = project.description;
    if (project.start_date !== undefined) result.start_date = project.start_date;
    if (project.deadline !== undefined) result.deadline = project.deadline;
    if (project.last_update !== undefined) result.last_update = project.last_update;
    if (project.status !== undefined) result.status = project.status;
    if (project.document_url !== undefined) result.document_url = project.document_url;
    return result;
  }

}
