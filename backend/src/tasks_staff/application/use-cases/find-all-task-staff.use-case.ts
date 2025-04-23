import { ForbiddenException, Injectable } from '@nestjs/common';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaffResponseDto } from '../../infrastructure/dto/task-staff-response.dto';
import { TaskStaffOrmEntity } from '../../infrastructure/persistence/task-staff.orm-entity';
import { TaskStaff } from '../../domain/entities/task-staff.entity';

@Injectable()
export class FindAllTaskStaffUseCase {
  constructor(
    private readonly taskStaffRepo: TaskStaffRepositoryPort
  ) {}

  async execute(ability: AppAbility): Promise<TaskStaffResponseDto[]> {
    const relaciones: TaskStaffOrmEntity[] = await this.taskStaffRepo.findWithRelations();

    if (!ability.can('read', TaskStaff)) {
      throw new ForbiddenException('No tienes permiso para acceder a las relaciones tarea-empleado');
    }

    return relaciones.map((rel) => ({
      id: rel.id,
      taskId: rel.task.id,
      staffId: rel.staff.id,
      taskTitle: rel.task.title,
      staffName: rel.staff.name,
      taskCompleted: rel.task.completed,
    }));
  }
}
