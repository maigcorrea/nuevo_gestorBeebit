import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GetEmailsUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(token: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.directusUrl}/users?fields=email`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Error obteniendo emails');
      }

      const data = await response.json();

      // Mapear y devolver los emails
      const emails = data.data.map((user: any) => user.email);
      return emails;
    } catch (error) {
      console.error('Error en GetEmailsUseCase:', error);
      throw new UnauthorizedException('Error obteniendo emails');
    }
  }
}
