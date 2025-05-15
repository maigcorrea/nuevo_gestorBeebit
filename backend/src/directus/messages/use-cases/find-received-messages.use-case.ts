// src/directus/messages/use-cases/find-received-messages.use-case.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class FindReceivedMessagesUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(token: string, userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.directusUrl}/items/Messages?filter[receiver][_eq]=${userId}&fields=*,sender.email`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error al obtener mensajes recibidos:', await response.text());
        throw new UnauthorizedException('No autorizado para acceder a mensajes recibidos');
      }

      const data = await response.json();
      console.log("DATOS DE MENSAJES RECIBIDOS", data.data)
      return data.data || [];
    } catch (error) {
      console.error('Error en FindReceivedMessagesUseCase:', error);
      throw error;
    }
  }
}
