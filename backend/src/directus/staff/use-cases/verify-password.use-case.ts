import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class VerifyPasswordUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.directusUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.data?.access_token) {
          return true;
        }
        return false;
      } else if (response.status === 401) {
        return false;
      } else {
        console.error('Error inesperado:', await response.text());
        throw new UnauthorizedException('Error verificando contraseña');
      }
    } catch (error) {
      console.error('Error en verifyPasswordUseCase:', error);
      throw new UnauthorizedException('Error verificando contraseña');
    }
  }
}
