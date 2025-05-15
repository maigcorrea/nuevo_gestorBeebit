// src/directus/messages/use-cases/find-sent-messages.use-case.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class FindSentMessagesUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(token: string, userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.directusUrl}/items/Messages?filter[sender][_eq]=${userId}&fields=*,receiver.email`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error al obtener mensajes enviados:', await response.text());
        throw new UnauthorizedException('No autorizado para acceder a mensajes enviados');
      }

      const data = await response.json();
      console.log("DATOS DE MENSAJES ENVIADOS", data.data);
      return data.data || [];
    } catch (error) {
      console.error('Error en FindSentMessagesUseCase:', error);
      throw error;
    }
  }
}
