import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
  import { ProjectByUserResponseDto } from '../../infrastructure/dto/project-by-user-response.dto';
  import { ProjectStatus } from 'src/project/domain/entities/project.entity';
  import { Inject } from '@nestjs/common';
  import { TASK_STAFF_REPOSITORY } from 'src/tasks_staff/domain/token/tasks-staff-repository.token';
  
  @Injectable()
  export class GetProjectsByUserUseCase {
    constructor(
      @Inject(TASK_STAFF_REPOSITORY)
      private readonly taskStaffRepo: TaskStaffRepositoryPort,
    ) {}
  
    async execute(userId: string, ability: AppAbility): Promise<ProjectByUserResponseDto[]> {
      const tasks = await this.taskStaffRepo.find({
        where: { staff: { id: userId } },
        relations: ['task', 'task.associated_project'],
      });
  
      if (!tasks || tasks.length === 0) {
        throw new NotFoundException(`No se encontraron tareas para el usuario con id ${userId}`);
      }
  
      const projectsMap = new Map<string, ProjectByUserResponseDto>();
  
      for (const rel of tasks) {
        const project = rel.task?.associated_project;
  
        if (!project) {
          console.warn(`⚠️ La tarea ${rel.task?.id} no tiene proyecto asociado`);
          continue;
        }
  
        if (!ability.can('read', project)) continue;
  
        if (!projectsMap.has(project.id)) {
          projectsMap.set(project.id, {
            id: project.id,
            title: project.title,
            description: project.description,
            start_date: project.start_date,
            deadline: project.deadline,
            last_update: project.last_update,
            status: project.status as ProjectStatus,
            document_url: project.document_url ?? undefined,
          });
        }
      }
  
      return Array.from(projectsMap.values());
    }
  }
  