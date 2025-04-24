import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { AppAbility } from '../../../casl/casl-ability.factory';
import { TaskTypeOrmEntity as TaskSubject } from '../../infrastructure/persistence/task.typeorm.entity';
import { Inject } from '@nestjs/common';
import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort) {}

  async execute(id: string, ability: AppAbility): Promise<{ message: string }> {
    const task = await this.taskRepo.findByIdWithProject(id);

    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }

    if (!ability.can('delete', TaskSubject)) {
      throw new ForbiddenException('No tienes permiso para borrar esta tarea');
    }

    const result = await this.taskRepo.delete(id);

    return { message: `Tarea con id ${id} eliminada con éxito` };
  }
}
