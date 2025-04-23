import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
  import { ProjectRepositoryPort } from 'src/project/domain/ports/project.repository.port';
  import { AppAbility } from '../../../casl/casl-ability.factory';
  import { UpdateTaskInput } from 'src/task/domain/interfaces/update-task.input';
  import { TaskStatus } from '../../domain/enums/task.enums';
  import { ProjectStatus } from 'src/project/domain/entities/project.entity';
  import { Task as TaskSubject } from 'src/task/infrastructure/persistence/task.typeorm.entity';
  import { Project } from 'src/project/domain/entities/project.entity';
  
  @Injectable()
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
  
      if (!ability.can('update', TaskSubject)) {
        throw new ForbiddenException('No tienes permiso para actualizar esta tarea');
      }
  
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
  
      if (task.associated_project?.id) {
        task.associated_project.last_update = new Date();
  
        const allTasks = await this.taskRepo.findByProject(task.associated_project.id);
        const todasCompletadas = allTasks.every(t => t.status === TaskStatus.COMPLETED);
  
        const nuevoEstado = todasCompletadas ? ProjectStatus.COMPLETED : ProjectStatus.ACTIVE;
  
        if (task.associated_project.status !== nuevoEstado) {
          task.associated_project.status = nuevoEstado;
  
          if (todasCompletadas) {
            task.associated_project.deadline = new Date();
          }
          await this.projectRepo.save(task.associated_project as Project);
        }
      }
  
      return { message: `Tarea con id ${id} actualizada con éxito` };
    }
  }
  