import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DeleteProjectUseCase {
  async execute(id: string, token: string): Promise<{ message: string }> {
    const directusUrl = process.env.DIRECTUS_URL;

    const response = await fetch(`${directusUrl}/items/Project/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(errorText || 'Error eliminando el proyecto en Directus');
    }

    return { message: `Proyecto con id ${id} eliminado con éxito` };
  }
}
