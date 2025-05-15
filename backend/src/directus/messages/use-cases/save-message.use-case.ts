// src/directus/messages/use-cases/save-message.use-case.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SaveMessageUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(token: string, senderId: string, { to, subject, text }): Promise<any> {
    try {
      // Primero: buscar el ID del receptor usando su email
      const findReceiver = await fetch(`${this.directusUrl}/users?filter[email][_eq]=${encodeURIComponent(to)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!findReceiver.ok) {
        console.error('Error buscando receptor:', await findReceiver.text());
        throw new UnauthorizedException('No autorizado para buscar receptor');
      }

      const receiverData = await findReceiver.json();

      if (!receiverData.data || receiverData.data.length === 0) {
        throw new Error('No se encontró un usuario con ese email');
      }

      const receiverId = receiverData.data[0].id; // 👈 Sacamos el ID del receptor

      // Segundo: guardar el mensaje
      const saveMessage = await fetch(`${this.directusUrl}/items/Messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: senderId,
          receiver: receiverId,
          subject,
          text,
          sendAt: new Date().toISOString(), // Fecha actual
        }),
      });

      if (!saveMessage.ok) {
        console.error('Error guardando mensaje:', await saveMessage.text());
        throw new UnauthorizedException('No autorizado para guardar mensaje');
      }

      const savedData = await saveMessage.json();
      return savedData.data;
    } catch (error) {
      console.error('Error en SaveMessageUseCase:', error);
      throw error;
    }
  }
}
