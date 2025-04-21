// src/task2/application/use-cases/update-task.use-case.ts

import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { ProjectRepositoryPort } from 'src/project2/domain/ports/project.repository.port'; // puedes crear esto más adelante
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Task } from '../../domain/entities/task.entity';
import { UpdateTaskInput } from '../../domain/interfaces/update-task.input';
import { TaskStatus } from '../../domain/entities/task.enums';
import { ProjectStatus } from 'src/project/entities/project.entity'; // este enum aún puede venir del proyecto original

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepo: TaskRepositoryPort,
    private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(id: string, input: UpdateTaskInput, ability: AppAbility): Promise<{ message: string }> {
    const task = await this.taskRepo.findByIdWithProject(id);

    if (!task) {
      throw new NotFoundException(`No se encontró la tarea con id ${id}`);
    }

    if (!ability.can('update', task)) {
      throw new ForbiddenException('No tienes permiso para actualizar esta tarea');
    }

    // Actualizamos los campos editables
    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.priority !== undefined) task.priority = input.priority;

    if (input.status !== undefined) {
      task.status = input.status;

      if (input.status === TaskStatus.COMPLETED) {
        task.completed = true;
        task.end_date = new Date();
      } else {
        task.completed = false;
        task.end_date = null;
      }
    }

    await this.taskRepo.save(task);

    // Actualizar el estado del proyecto si corresponde
    if (task.associated_project) {
      task.associated_project.last_update = new Date();

      const allTasks = await this.taskRepo.findByProjectId(task.associated_project.id);
      const allCompleted = allTasks.every(t => t.status === TaskStatus.COMPLETED);
      const newStatus = allCompleted ? ProjectStatus.COMPLETED : ProjectStatus.ACTIVE;

      if (task.associated_project.status !== newStatus) {
        task.associated_project.status = newStatus;
        if (allCompleted) {
          task.associated_project.deadline = new Date();
        }
        await this.projectRepo.save(task.associated_project);
      }
    }

    return { message: `Tarea con id ${id} actualizada con éxito` };
  }
}
