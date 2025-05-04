import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { CreateTaskInput } from '../../domain/interfaces/create-task.input';
import { Task } from 'src/task/domain/entities/task.entity';
import { Task as TaskSubject } from 'src/task/infrastructure/persistence/task.typeorm.entity';
import { AppAbility } from '../../../casl/casl-ability.factory';
import { TaskStatus, TaskPriority } from '../../domain/enums/task.enums';
import * as crypto from 'crypto';
import { Inject } from '@nestjs/common';
import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';
import { ClockifyService } from 'src/infrastructure/clockify/clockyfy.service';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';
import { ProjectRepositoryPort } from 'src/project/domain/ports/project.repository.port';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort,
    private readonly clockifyService: ClockifyService,
  ) {}

  async execute(input: CreateTaskInput, ability: AppAbility): Promise<Task> {
    if (!ability.can('create', TaskSubject)) {
      throw new ForbiddenException('No tienes permiso para crear nuevas tareas');
    }

    if (input.start_date) {
      const fechaInicio = new Date(input.start_date);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaInicio < hoy) {
        throw new BadRequestException('La fecha de inicio no puede ser anterior a hoy');
      }
    }

    const startDate = input.start_date ? new Date(input.start_date) : new Date();

    const task = new Task(
      crypto.randomUUID(),
      input.title,
      input.description,
      input.associated_project_id,
      startDate,
      null, // end_date
      false, // completed
      input.priority as TaskPriority,
      TaskStatus.PENDING, // estado por defecto
      null,// clockifyTaskId, lo asignaremos después
    );

     // Obtener el ID del proyecto en Clockify (desde tu repositorio)
      const project = await this.projectRepo.findById(input.associated_project_id);
      const clockifyProjectId = project?.clockifyProjectId;

     if (clockifyProjectId) {
      try {
        const createdTask = await this.clockifyService.createTaskOnClockify({
          name: task.title,
          projectId: clockifyProjectId,
          workspaceId: this.clockifyService.getWorkspaceId(), // o úsalo desde ConfigService,
        });

        task.clockifyTaskId = createdTask.id;
      } catch (error) {
        console.warn('[Clockify] No se pudo crear la tarea en Clockify:', error.message);
        // puedes continuar sin lanzar excepción
      }
    }

    return this.taskRepo.create(task);
  }
}
