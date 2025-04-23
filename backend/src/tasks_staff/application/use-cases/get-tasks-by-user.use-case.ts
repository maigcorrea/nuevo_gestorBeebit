import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { TaskByUserResponseDto } from 'src/tasks_staff/infrastructure/dto/task-by-user-response.dto';
  
  @Injectable()
  export class GetTasksByUserUseCase {
    constructor(private readonly taskStaffRepo: TaskStaffRepositoryPort) {}
  
    async execute(id: string, ability: AppAbility): Promise<TaskByUserResponseDto[]> {
      console.log('Buscando tareas para ID:', id);
  
      try {
        const relaciones = await this.taskStaffRepo.find({
          where: {
            staff: { id },
          },
          relations: ['task', 'task.associated_project'],
        });
  
        console.log('Tareas encontradas:', relaciones);
  
        if (!relaciones || relaciones.length === 0) {
          throw new NotFoundException(`No se encontraron tareas para el empleado con id ${id}`);
        }
  
        const tareasFiltradas = relaciones.filter((rel) =>
          ability.can('read', rel.task),
        );
  
        if (tareasFiltradas.length === 0) {
          throw new ForbiddenException('No tienes permiso para ver estas tareas');
        }
  
        return tareasFiltradas.map((rel) => ({
          id: rel.task.id,
          title: rel.task.title,
          description: rel.task.description,
          start_date: rel.task.start_date,
          end_date: rel.task.end_date,
          status: rel.task.status,
          completed: rel.task.completed,
          priority: rel.task.priority,
          associated_project: {
            id: rel.task.associated_project?.id ?? null,
            name: rel.task.associated_project?.title ?? null,
          },
        }));
      } catch (error) {
        console.error('Error interno en getTasksByUser:', error);
        throw new InternalServerErrorException('Error al obtener tareas');
      }
    }
  }
  