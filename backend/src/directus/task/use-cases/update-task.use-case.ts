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

    return { message: 'Tarea actualizada correctamente' };
  }
}
