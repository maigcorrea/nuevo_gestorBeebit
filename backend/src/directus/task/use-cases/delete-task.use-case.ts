import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DeleteTaskUseCase {
  async execute(id: string, token: string): Promise<{ message: string }> {
    const directusUrl = process.env.DIRECTUS_URL;

    const response = await fetch(`${directusUrl}/items/Task/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(errorText || 'Error eliminando la tarea en Directus');
    }

    return { message: `Tarea con id ${id} eliminada con éxito` };
  }
}
