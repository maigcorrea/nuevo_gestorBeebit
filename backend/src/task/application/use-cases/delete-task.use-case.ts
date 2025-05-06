import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { AppAbility } from '../../../casl/casl-ability.factory';
import { TaskTypeOrmEntity as TaskSubject } from '../../infrastructure/persistence/task.typeorm.entity';
import { Inject } from '@nestjs/common';
import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';
import { ClockifyService } from 'src/infrastructure/clockify/clockyfy.service';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    private readonly clockifyService: ClockifyService,
  ) {}

  async execute(id: string, ability: AppAbility): Promise<{ message: string }> {
    const task = await this.taskRepo.findByIdWithProject(id);

    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }

    if (!ability.can('delete', TaskSubject)) {
      throw new ForbiddenException('No tienes permiso para borrar esta tarea');
    }

    console.log("TASK.CLOCKIFYTASKID", task.clockifyTaskId);
    console.log("task.associated_project?.clockifyProjectId", task.associated_project?.clockifyProjectId);
    
    if (task.clockifyTaskId && task.associated_project?.clockifyProjectId) {
      try {
        await this.clockifyService.deleteTaskOnClockify(task.associated_project.clockifyProjectId, task.clockifyTaskId);
      } catch (err) {
        console.error('Error borrando la tarea en Clockify:', err.message);
        // Puedes decidir si continuar de todos modos o lanzar error
      }
    }
    const result = await this.taskRepo.delete(id);

    return { message: `Tarea con id ${id} eliminada con éxito` };
  }
}
