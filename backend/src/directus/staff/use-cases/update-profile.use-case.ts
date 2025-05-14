// src/directus/staff/use-cases/update-profile.use-case.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateStaffDto } from '../dto/update-staff.dto';

@Injectable()
export class UpdateProfileUseCase {
  async execute(userId: string, dto: UpdateStaffDto, token: string): Promise<{ message: string }> {
    const directusUrl = process.env.DIRECTUS_URL;

    const updateRes = await fetch(`${directusUrl}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      throw new BadRequestException(errorText || 'Error actualizando el perfil en Directus');
    }

    return { message: 'Perfil actualizado correctamente' };
  }
}
