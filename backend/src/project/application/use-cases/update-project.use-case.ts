import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { ProjectRepositoryPort } from '../../domain/ports/project.repository.port';
  import { ProjectStatus } from '../../domain/entities/project.entity';
  import { UpdateProjectInput } from '../../domain/interfaces/update-project.input';
  import { AppAbility } from '../../../casl/casl-ability.factory';
  import { Project as ProjectSubject } from '../../domain/entities/project.entity';  // solo para CASL
  import { TaskRepositoryPort } from 'src/task/domain/ports/task.repository.port';
  import { TaskStatus } from 'src/task/domain/enums/task.enums';
  
  @Injectable()
  export class UpdateProjectUseCase {
    constructor(
      private readonly projectRepo: ProjectRepositoryPort,
      private readonly taskRepo: TaskRepositoryPort, // ← lo añadiremos más adelante
    ) {}
  
    async execute(
      id: string,
      input: UpdateProjectInput,
      ability: AppAbility,
    ): Promise<{ message: string }> {
      const project = await this.projectRepo.findById(id);
  
      if (!project) {
        throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
      }
  
      if (!ability.can('update', 'Project')) {
        throw new ForbiddenException('No tienes permiso para modificar este proyecto');
      }
      
  
      const { title, description, start_date, deadline, status } = input;
  
      if (
        title === undefined &&
        description === undefined &&
        start_date === undefined &&
        deadline === undefined &&
        status === undefined
      ) {
        throw new BadRequestException(
          'Debes proporcionar al menos un campo para actualizar',
        );
      }
  
      // Validaciones de fechas
      const nuevaInicio = start_date ? new Date(start_date) : project.start_date;
      const nuevaDeadline = deadline ? new Date(deadline) : project.deadline;
  
      if (nuevaDeadline && nuevaInicio && nuevaDeadline < nuevaInicio) {
        throw new BadRequestException(
          'La fecha de entrega no puede ser anterior a la fecha de inicio',
        );
      }
  
      // Aplicar actualizaciones
      if (title !== undefined) project.title = title;
      if (description !== undefined) project.description = description;
      if (start_date !== undefined) project.start_date = nuevaInicio;
      if (deadline !== undefined) project.deadline = nuevaDeadline;
      if (status !== undefined) project.status = status;


      if (status === ProjectStatus.COMPLETED) {
        const tasks = await this.taskRepo.findByProject(project.id);
      
        for (const task of tasks) {
          task.status = TaskStatus.COMPLETED;
          task.completed = true;
          task.end_date = new Date();
          await this.taskRepo.save(task); // o update si usas update(id, task)
        }
      }
  
      await this.projectRepo.update(id, project);
  
      // Si el estado es 'completed', más adelante añadiremos actualización de tareas
  
      return { message: `Proyecto con id ${id} actualizado con éxito` };
    }
  }
  