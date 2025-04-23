import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
  import { Task } from '../../domain/entities/task.entity';
  import { TaskTypeOrmEntity as TaskSubject } from 'src/task/infrastructure/persistence/task.typeorm.entity';
  import { AppAbility } from '../../../casl/casl-ability.factory';
  
  @Injectable()
  export class FindTasksByProjectUseCase {
    constructor(private readonly taskRepo: TaskRepositoryPort) {}
  
    async execute(projectId: string, ability: AppAbility): Promise<Task[]> {
      const tasks = await this.taskRepo.findByProject(projectId);
  
      if (!tasks.length) {
        throw new NotFoundException('No se encontraron tareas para este proyecto');
      }
  
      const allowedTasks = tasks.filter(task => ability.can('update', TaskSubject));
  
      if (!allowedTasks.length) {
        throw new ForbiddenException('No tienes permiso para ver estas tareas');
      }
  
      return allowedTasks;
    }
  }
  