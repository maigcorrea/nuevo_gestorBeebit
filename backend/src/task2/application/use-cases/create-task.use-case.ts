import { CreateTaskInput } from '../../domain/interfaces/create-task.input';
import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../../domain/entities/task.enums';
import { Task } from '../../domain/entities/task.entity';

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(input: CreateTaskInput, ability: any): Promise<Task> {
    if (!ability.can('create', Task)) {
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

    const newTask = new Task(
      '', // ID aún no generado
      input.title,
      input.description || '',
      input.associated_project,
      input.start_date ? new Date(input.start_date) : new Date(),
      null,                // end_date → null al crear
      false,               // completed → false al crear
      input.priority,
      TaskStatus.PENDING,  // status por defecto
    );

    return await this.taskRepo.save(newTask);
  }
}
