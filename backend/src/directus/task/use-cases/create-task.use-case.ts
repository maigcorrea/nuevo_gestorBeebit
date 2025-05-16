// src/directus/task/use-cases/create-task.use-case.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class CreateTaskUseCase {
  async execute(dto: CreateTaskDto, token: string): Promise<any> {
    const response = await fetch(`${process.env.DIRECTUS_URL}/items/Task`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: dto.title,
        description: dto.description || null,
        start_date: dto.start_date || null,
        priority: dto.priority,
        associated_project: dto.associated_project,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      console.error('❌ Error al crear la tarea en Directus:', json);
      throw new InternalServerErrorException('Error al crear la tarea');
    }

    return json.data;
  }
}
