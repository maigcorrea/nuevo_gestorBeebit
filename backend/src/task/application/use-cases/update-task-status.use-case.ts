import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
  import { ProjectRepositoryPort } from 'src/project/domain/ports/project.repository.port';
  import { AppAbility } from '../../../casl/casl-ability.factory';
  import { UpdateTaskStatusInput } from 'src/task/domain/interfaces/update-task-status.input';
  import { TaskStatus } from '../../domain/enums/task.enums';
  import { ProjectStatus } from 'src/project/domain/entities/project.entity';
  import { Project } from 'src/project/domain/entities/project.entity';
  import { TaskTypeOrmEntity as TaskSubject } from '../../infrastructure/persistence/task.typeorm.entity';
  import { Inject } from '@nestjs/common';
  import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';
  import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';
  
  @Injectable()
  export class UpdateTaskStatusUseCase {
    constructor(
      @Inject(TASK_REPOSITORY)
      private readonly taskRepo: TaskRepositoryPort,
      @Inject(PROJECT_REPOSITORY)
      private readonly projectRepo: ProjectRepositoryPort,
    ) {}
  
    async execute(id: string, dto: UpdateTaskStatusInput, ability: AppAbility): Promise<{ message: string }> {
      const task = await this.taskRepo.findByIdWithProject(id);
      if (!task) {
        throw new NotFoundException(`Tarea con id ${id} no encontrada`);
      }
  
      if (!ability.can('update', TaskSubject)) {
        throw new ForbiddenException('No tienes permiso para actualizar el estado de esta tarea');
      }
  
      task.status = dto.status;
  
      if (dto.status === TaskStatus.COMPLETED) {
        task.completed = true;
        task.end_date = new Date();
      } else {
        task.completed = false;
        task.end_date = null;
      }
  
      await this.taskRepo.save(task);

      if (!task.associated_project) {
        throw new Error('La tarea no tiene un proyecto asociado');
      }
      const allTasks = await this.taskRepo.findByProject(task.associated_project.id);
      const todasCompletadas = allTasks.every(t => t.status === TaskStatus.COMPLETED);
      const nuevoEstado = todasCompletadas ? ProjectStatus.COMPLETED : ProjectStatus.ACTIVE;
  
      const project = task.associated_project as Project;
      project.last_update = new Date();
  
      if (project.status !== nuevoEstado) {
        project.status = nuevoEstado;
        if (todasCompletadas) {
          project.deadline = new Date();
        }
      }
  
      await this.projectRepo.save(project);
  
      return { message: `Estado de la tarea actualizado a ${dto.status}` };
    }
  }
  