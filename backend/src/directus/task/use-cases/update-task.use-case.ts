import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';


@Injectable()
export class UpdateTaskUseCase {
  async execute(id: string, dto: UpdateTaskDto, token: string): Promise<{ message: string }> {
    const directusUrl = process.env.DIRECTUS_URL;

    const response = await fetch(`${directusUrl}/items/Task/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(errorText || 'Error actualizando la tarea en Directus');
    }

    // 2. Si status es "completed", actualizar completed: true y end_date: now
    if (dto.status === 'completed') {
        await fetch(`${directusUrl}/items/Task/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completed: true,
            end_date: new Date().toISOString(),
          }),
        });
    }else{
        await fetch(`${directusUrl}/items/Task/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: false,
                end_date: new Date().toISOString(),
            }),
        });
    }



    // 3. Buscar la tarea actualizada para saber su proyecto asociado
    const taskRes = await fetch(`${directusUrl}/items/Task/${id}?fields=associated_project`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const taskData = await taskRes.json();
      const projectId = taskData?.data?.associated_project;
  
      if (projectId) {
        // 4. Obtener todas las tareas de ese proyecto
        const tasksRes = await fetch(`${directusUrl}/items/Task?filter[associated_project][_eq]=${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const tasksData = await tasksRes.json();
        const tareas = tasksData?.data || [];
  
        const todasCompletadas = tareas.every((t: any) => t.status === 'completed');
  
        if (todasCompletadas) {
          // 5. Actualizar estado del proyecto a "completed" y deadline = ahora
          await fetch(`${directusUrl}/items/Project/${projectId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'completed',
              deadline: new Date().toISOString(),
            }),
          });
        } else {
          // Si no todas están completadas, asegurar que el proyecto esté en estado "active"
          await fetch(`${directusUrl}/items/Project/${projectId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'active',
            }),
          });
        }
      }

    

    return { message: 'Tarea actualizada correctamente' };
  }
}
