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
import { Staff } from 'src/staff/domain/entities/staff.entity';
import { StaffRepositoryPort } from 'src/staff/domain/ports/staff.repository.port';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepositoryPort,
    private readonly clockifyService: ClockifyService,
  ) {}

  async execute(input: CreateTaskInput, ability: AppAbility): Promise<Task> {
    console.log('[CreateTaskUseCase] Entrando al caso de uso');
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
      console.log('clockifyProjectId:', clockifyProjectId);
     if (clockifyProjectId) {
      try {
      const assigneeIds: string[] = [];

      if (input.staffIds?.length) {
        console.log('CLOCKIFY: input.staffIds recibido:', input.staffIds);
        for (const staffId of input.staffIds) {
          const staff = await this.staffRepo.findById(staffId);
          if (!staff) continue;
  
          

          // Si no tiene clockifyUserId, intenta obtenerlo desde la API
          if (!staff.clockifyUserId || staff.clockifyUserId === '') {
            const userIdFromClockify = await this.clockifyService.getClockifyUserIdByEmail(staff.email);
            console.log("Datos de clockify del usuario", userIdFromClockify, staff.email)

            if (userIdFromClockify) {
              await this.staffRepo.updateClockifyUserId(staffId, userIdFromClockify);
              assigneeIds.push(userIdFromClockify);
            } else {
              console.warn(`[Clockify] No se encontró el ID para ${staff.email}. Debe estar en el workspace.`);
            }
          }else{
            assigneeIds.push(staff.clockifyUserId);
          }
        }
      }

      console.log("assigneeIds:",assigneeIds);
      const createdTask = await this.clockifyService.createTaskOnClockify({
        name: task.title,
        projectId: clockifyProjectId,
        workspaceId: this.clockifyService.getWorkspaceId(),
        assigneeIds,
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
