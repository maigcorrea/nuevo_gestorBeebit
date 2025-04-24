import { ForbiddenException, Injectable } from '@nestjs/common';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaff } from '../../domain/entities/task-staff.entity';
import { TaskWithStaffResponseDto } from 'src/tasks_staff/infrastructure/dto/task-with-staff-response.dto';
import { TaskStaffOrmEntity } from 'src/tasks_staff/infrastructure/persistence/task-staff.orm-entity';
@Injectable()
export class FindTaskStaffGroupedByTaskUseCase {
  constructor(
    private readonly taskStaffRepo: TaskStaffRepositoryPort,
  ) {}

  async execute(ability: AppAbility): Promise<TaskWithStaffResponseDto[]> {
    const relaciones = await this.taskStaffRepo.findWithRelations();

    if (!ability.can('read', TaskStaffOrmEntity)) {
      throw new ForbiddenException('No tienes permiso para acceder a las relaciones tarea-empleado');
    }

    const agrupado = new Map<string, { taskTitle: string; staff: { id: string; name: string }[] }>();

    for (const rel of relaciones) {
      if (!rel.task || !rel.staff) continue;

      const taskId = rel.task.id;
      const taskTitle = rel.task.title;
      const staffId = rel.staff.id;
      const staffName = rel.staff.name;

      const staffEntry = { id: staffId, name: staffName };

      if (!agrupado.has(taskId)) {
        agrupado.set(taskId, { taskTitle, staff: [staffEntry] });
      } else {
        agrupado.get(taskId)!.staff.push(staffEntry);
      }
    }

    const resultado: TaskWithStaffResponseDto[] = [];

    agrupado.forEach((value, taskId) => {
      resultado.push({
        taskId,
        taskTitle: value.taskTitle,
        staff: value.staff,
      });
    });

    return resultado;
  }
}
