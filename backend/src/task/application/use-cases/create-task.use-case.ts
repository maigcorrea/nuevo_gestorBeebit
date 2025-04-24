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

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
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
    );

    return this.taskRepo.create(task);
  }
}
