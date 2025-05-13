// src/directus/project/use-cases/update-project.use-case.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class UpdateProjectUseCase {
  async execute(id: string, dto: UpdateProjectDto, token: string): Promise<{ message: string }> {
    const directusUrl = process.env.DIRECTUS_URL;

    // 1. Actualizar el proyecto normalmente
    const response = await fetch(`${directusUrl}/items/Project/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(errorText || 'Error actualizando el proyecto en Directus');
    }

    // 2. Si el estado es "completed", actualizar todas sus tareas a completed
    if (dto.status === 'completed') {
      // 2.1 Obtener todas las tareas asociadas al proyecto
      const tasksRes = await fetch(`${directusUrl}/items/Task?filter[associated_project][_eq]=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const tasksData = await tasksRes.json();
      const tareas = tasksData?.data || [];

      // 2.2 Actualizar cada tarea una por una
      for (const tarea of tareas) {
        await fetch(`${directusUrl}/items/Task/${tarea.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'completed',
            completed: true,
            end_date: new Date().toISOString(),
          }),
        });
      }
    }

    return { message: 'Proyecto actualizado correctamente' };
  }
}
