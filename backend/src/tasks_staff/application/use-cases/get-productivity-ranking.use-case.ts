import { Injectable, Inject } from '@nestjs/common';
import { TASK_STAFF_REPOSITORY } from '../../domain/token/tasks-staff-repository.token';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { ProductivityRankingResponseDto } from '../../infrastructure/dto/productivity-ranking.response.dto';
import { AppAbility } from 'src/casl/casl-ability.factory';

@Injectable()
export class GetProductivityRankingUseCase {
  constructor(
    @Inject(TASK_STAFF_REPOSITORY)
    private readonly taskStaffRepo: TaskStaffRepositoryPort,
  ) {}

  async execute(ability: AppAbility): Promise<ProductivityRankingResponseDto[]> {
    const relaciones = await this.taskStaffRepo.findWithRelations();

    // Aplicar permisos si es necesario
    const permitidas = relaciones.filter(relacion =>
      ability.can('read', relacion),
    );

    // Agrupar tareas completadas por nombre de empleado
    const resumen: Record<string, number> = {};

    permitidas.forEach(relacion => {
      const nombre = relacion.staff?.name;
      const completada = relacion.task?.completed;

      if (nombre && completada) {
        resumen[nombre] = (resumen[nombre] || 0) + 1;
      }
    });

    // Convertir el resumen a un array ordenado
    const ranking = Object.entries(resumen)
      .map(([name, completed]) => ({ name, completed }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0,3);

    return ranking;
  }
}