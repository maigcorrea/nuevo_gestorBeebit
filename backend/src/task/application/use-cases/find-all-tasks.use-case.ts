import { Injectable, ForbiddenException } from '@nestjs/common';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/entities/task.entity';
import { TaskTypeOrmEntity as TaskSubject } from 'src/task/infrastructure/persistence/task.typeorm.entity';
import { AppAbility } from '../../../casl/casl-ability.factory';
import { Inject } from '@nestjs/common';
import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';

@Injectable()
export class FindAllTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort
  ) {}

  async execute(ability: AppAbility): Promise<Task[]> {
    if (!ability.can('read', TaskSubject)) {
      throw new ForbiddenException('No tienes permiso para acceder a las tareas');
    }

    return this.taskRepo.findAllWithProject(); // lo definiremos en el repositorio
  }
}
