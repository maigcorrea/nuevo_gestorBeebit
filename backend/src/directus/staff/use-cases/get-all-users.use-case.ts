import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GetAllUsersUseCase {
  async execute(token: string): Promise<any[]> {
    try {
      const res = await fetch(`${process.env.DIRECTUS_URL}/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Error al obtener usuarios desde Directus');
      }

      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error('Error en GetAllUsersUseCase:', err);
      throw new InternalServerErrorException('Error al obtener usuarios');
    }
  }
}
