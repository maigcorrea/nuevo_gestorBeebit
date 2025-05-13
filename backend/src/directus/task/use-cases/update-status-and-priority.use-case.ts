import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Buffer } from 'buffer';

@Injectable()
export class UpdateStatusAndPriorityUseCase {
  async execute(taskId: string, status: string, priority: string, accessToken: string): Promise<any> {
    const directusUrl = process.env.DIRECTUS_URL;

    // 1. Obtener la tarea completa (incluyendo su proyecto asociado)
    const taskResponse = await fetch(`${directusUrl}/items/Task/${taskId}?fields=*,associated_project.id`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!taskResponse.ok) {
      throw new NotFoundException('Tarea no encontrada');
    }

    const taskData = await taskResponse.json();
    const task = taskData.data;

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    const associatedProjectId = task.associated_project?.id;

    if (!associatedProjectId) {
      throw new NotFoundException('No se encontró el proyecto asociado a la tarea');
    }

    // 2. Actualizar la tarea
    const completed = status === 'completed';
    const endDate = completed ? new Date().toISOString() : null;

    const updateTaskResponse = await fetch(`${directusUrl}/items/Task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        status,
        priority,
        completed,
        end_date: endDate,
      }),
    });

    if (!updateTaskResponse.ok) {
      throw new BadRequestException('No se pudo actualizar la tarea');
    }

    const updatedTaskData = await updateTaskResponse.json();
    const updatedTask = updatedTaskData.data;

    // 3. Comprobar si todas las tareas del proyecto están completadas
    const tasksOfProjectResponse = await fetch(`${directusUrl}/items/Task?filter[associated_project][id][_eq]=${associatedProjectId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!tasksOfProjectResponse.ok) {
      throw new BadRequestException('No se pudieron obtener las tareas del proyecto');
    }

    const tasksOfProjectData = await tasksOfProjectResponse.json();
    const tasksOfProject = tasksOfProjectData.data;

    const todasCompletadas = tasksOfProject.every((t: any) => t.status === 'completed');

    // 4. Actualizar el proyecto si corresponde
    const nuevoEstado = todasCompletadas ? 'completed' : 'active';
    const projectPatch: any = {
      status: nuevoEstado,
      last_update: new Date().toISOString(),
    };

    if (todasCompletadas) {
      projectPatch.deadline = new Date().toISOString();
    }

    const updateProjectResponse = await fetch(`${directusUrl}/items/Project/${associatedProjectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(projectPatch),
    });

    if (!updateProjectResponse.ok) {
      throw new BadRequestException('No se pudo actualizar el proyecto');
    }

    return updatedTask;
  }
}
