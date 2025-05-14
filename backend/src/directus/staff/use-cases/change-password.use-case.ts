import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChangePasswordUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  constructor(private readonly httpService: HttpService) {}

  async execute(token: string, newPassword: string) {
    try {
      // 1️⃣ Obtener el ID del usuario actual
      const profileRes = await firstValueFrom(
        this.httpService.get(`${this.directusUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      const userId = profileRes.data.data.id;

      // 2️⃣ Actualizar la contraseña
      await firstValueFrom(
        this.httpService.patch(`${this.directusUrl}/users/${userId}`, {
          password: newPassword,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw new UnauthorizedException('Error actualizando contraseña');
    }
  }
}
