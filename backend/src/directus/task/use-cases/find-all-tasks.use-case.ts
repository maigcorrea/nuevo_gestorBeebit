import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TaskResponseDto } from '../dto/task-response.dto';

@Injectable()
export class FindAllTasksUseCase {
  async execute(accessToken: string): Promise<TaskResponseDto[]> {
    const directusUrl = process.env.DIRECTUS_URL;

    const res = await fetch(`${directusUrl}/items/Task`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new UnauthorizedException('No autorizado o token inválido');
    }

    const data = await res.json();

    return data.data; // Devolvemos el array de tareas
  }
}
