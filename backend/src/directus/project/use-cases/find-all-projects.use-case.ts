// src/directus/project/use-cases/find-all-projects.use-case.ts

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FindAllProjectsUseCase {
  async execute(accessToken: string): Promise<any> {
    const directusUrl = process.env.DIRECTUS_URL;

    const res = await fetch(`${directusUrl}/items/Project`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new BadRequestException(errorText || 'Error al obtener los proyectos desde Directus');
    }

    const data = await res.json();
    return data.data; // devolver solo los proyectos
  }
}
