import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

@Injectable()
export class GetProfileUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const response = await fetch(`${this.directusUrl}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(errorText || 'Error obteniendo el perfil en Directus');
    }

    const data = await response.json();
    return data.data;
  }
}
