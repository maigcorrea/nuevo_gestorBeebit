import { ForbiddenException } from '@nestjs/common';
import { Task } from '../../domain/entities/task.entity';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';

export class FindAllTasksUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(ability: any): Promise<Task[]> {
    if (!ability.can('read', Task)) {
      throw new ForbiddenException('No tienes permiso para acceder a las tareas');
    }

    return await this.taskRepo.findAll();
  }
}
