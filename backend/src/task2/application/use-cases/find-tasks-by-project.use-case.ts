import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Task } from '../../domain/entities/task.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Project } from 'src/project/entities/project.entity';

export class FindTasksByProjectUseCase {
  constructor(private readonly repo: TaskRepositoryPort) {}

  async execute(projectId: string, ability: AppAbility): Promise<Task[]> {
    const tasks = await this.repo.findByProjectId(projectId);

    if (!tasks.length) {
      throw new NotFoundException('No se encontraron tareas para este proyecto');
    }

    const allowedTasks = tasks.filter(task =>
        ability.can('read', {
          ...task,
          associated_project: { id: task.associated_project } as Project
        })
      );

    if (!allowedTasks.length) {
      throw new ForbiddenException('No tienes permiso para ver estas tareas');
    }

    return allowedTasks;
  }
}
