import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GetAllProjectsUseCase {
  async execute(token: string): Promise<any[]> {
    try {
      const res = await fetch(`${process.env.DIRECTUS_URL}/items/Project`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Error al obtener proyectos de Directus');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error('Error en GetAllProjectsUseCase:', err);
      throw new InternalServerErrorException('Error al obtener proyectos');
    }
  }
}
