import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CheckEmailExistsUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(email: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.directusUrl}/users?filter[email][_eq]=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return data.data && data.data.length > 0;
      } else {
        console.error('Error buscando email:', data);
        throw new Error('Error buscando email');
      }
    } catch (error) {
      console.error('Error en CheckEmailExistsUseCase:', error);
      throw error;
    }
  }
}
