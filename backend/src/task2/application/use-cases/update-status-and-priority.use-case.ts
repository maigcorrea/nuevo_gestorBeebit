import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
  import { ProjectRepositoryPort } from '../../../project2/domain/ports/project.repository.port';
  import { TaskStatus } from '../../domain/enums/task.enums';
  import { TaskPriority } from '../../domain/enums/task.enums';
  import { AppAbility } from '../../../casl/casl-ability.factory';
  import { ProjectStatus } from '../../../project2/domain/entities/project.entity';
  import { TaskTypeOrmEntity as TaskSubject } from '../../infrastructure/persistence/task.typeorm.entity';
  
  @Injectable()
  export class UpdateStatusAndPriorityUseCase {
    constructor(
      private readonly taskRepo: TaskRepositoryPort,
      private readonly projectRepo: ProjectRepositoryPort
    ) {}
  
    async execute(
      id: string,
      status: TaskStatus,
      priority: TaskPriority,
      ability: AppAbility
    ) {
      const task = await this.taskRepo.findByIdWithProject(id);
  
      if (!task) throw new NotFoundException('Tarea no encontrada');
  
      if (!ability.can('update', TaskSubject)) {
        throw new ForbiddenException('No tienes permiso para modificar el estado y prioridad de esta tarea');
      }
  
      if (!Object.values(TaskStatus).includes(status)) {
        throw new BadRequestException('Estado no válido');
      }
  
      if (!Object.values(TaskPriority).includes(priority)) {
        throw new BadRequestException('Prioridad no válida');
      }
  
      task.status = status;
      task.priority = priority;
  
      if (status === TaskStatus.COMPLETED) {
        task.completed = true;
        task.end_date = new Date();
      } else {
        task.completed = false;
        task.end_date = null;
      }
  
      await this.taskRepo.save(task);
  
      if (!task.associated_project) {
        throw new NotFoundException('El proyecto asociado no se encontró');
      }

      const allTasks = await this.taskRepo.findByProject(task.associated_project.id);
      const todasCompletadas = allTasks.every(t => t.status === TaskStatus.COMPLETED);
      const nuevoEstado = todasCompletadas ? ProjectStatus.COMPLETED : ProjectStatus.ACTIVE;
  
      const project = task.associated_project;
      project.last_update = new Date();
  
      if (project.status !== nuevoEstado) {
        project.status = nuevoEstado;
        if (todasCompletadas) {
          project.deadline = new Date();
        }
      }
  
      const fullProject = await this.projectRepo.findById(project.id);
      if (!fullProject) {
        throw new NotFoundException('El proyecto completo no se encontró');
      }
      
      Object.assign(fullProject, project);
      await this.projectRepo.save(fullProject);
  
      return task;
    }
  }
  