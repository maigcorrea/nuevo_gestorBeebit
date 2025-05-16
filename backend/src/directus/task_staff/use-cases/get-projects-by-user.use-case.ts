import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProjectByUserResponseDto } from 'src/directus/task_staff/dto/project-by-user-response.dto';

@Injectable()
export class GetProjectsByUserUseCase {
  async execute(token: string, userId: string): Promise<ProjectByUserResponseDto[]> {
    try {
      const response = await fetch(
        `${process.env.DIRECTUS_URL}/items/Task_staff?filter[staff][_eq]=${userId}&fields=task.associated_project.id,task.associated_project.title,task.associated_project.description,task.associated_project.start_date,task.associated_project.deadline,task.associated_project.last_update,task.associated_project.status,task.associated_project.document.*`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Error al consultar proyectos en Directus');
      }

      const json = await response.json();
      const relaciones = json.data;

      if (!relaciones || relaciones.length === 0) {
        throw new NotFoundException(`No se encontraron proyectos para el usuario con id ${userId}`);
      }

      // Mapeamos proyectos únicos
      const projectsMap = new Map<string, ProjectByUserResponseDto>();

      for (const rel of relaciones) {
        const project = rel.task?.associated_project;

        if (!project) continue; // Si la tarea no tiene proyecto asociado, saltamos

        if (!projectsMap.has(project.id)) {
          projectsMap.set(project.id, {
            id: project.id,
            title: project.title,
            description: project.description,
            start_date: project.start_date,
            deadline: project.deadline,
            last_update: project.last_update,
            status: project.status,
            document: project.document ?? undefined,
          });
        }
      }

      return Array.from(projectsMap.values());
    } catch (error) {
      console.error('Error interno en getProjectsByUser:', error);
      throw new InternalServerErrorException('Error al obtener proyectos');
    }
  }
}
