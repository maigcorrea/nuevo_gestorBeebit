import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaskByUserResponseDto } from '../dto/task-by-user-response.dto';

@Injectable()
export class GetTasksByUserUseCase {
  async execute(token: string, userId: string): Promise<TaskByUserResponseDto[]> {
    try {
      const response = await fetch(
         `${process.env.DIRECTUS_URL}/items/Task_staff?filter[staff][_eq]=${userId}&fields=task.id,task.title,task.description,task.start_date,task.end_date,task.status,task.completed,task.priority,task.associated_project.id,task.associated_project.title`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Error al consultar tareas en Directus');
      }

      const json = await response.json();
      const relaciones = json.data;

      return relaciones.map((rel: any) => ({
        id: rel.task.id,
        title: rel.task.title,
        description: rel.task.description,
        start_date: rel.task.start_date,
        end_date: rel.task.end_date,
        status: rel.task.status,
        completed: rel.task.completed,
        priority: rel.task.priority,
        associated_project: {
            id: rel.task.associated_project?.id ?? null,
            name: rel.task.associated_project?.title ?? null,
        },
      }));
    } catch (error) {
      console.error('Error interno en getTasksByUser:', error);
      throw new InternalServerErrorException('Error al obtener tareas');
    }
  }
}
