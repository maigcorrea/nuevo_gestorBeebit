import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class FindSentMessagesUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(token: string, userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.directusUrl}/items/messages?filter[sender][_eq]=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept':'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error al obtener mensajes:', await response.text());
        throw new UnauthorizedException('No autorizado para acceder a mensajes');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error en FindSentMessagesUseCase:', error);
      throw error;
    }
  }
}
