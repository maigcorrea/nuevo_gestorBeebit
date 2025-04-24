import {
    ConflictException,
    ForbiddenException,
    Injectable,
    Inject,
    NotFoundException,
  } from '@nestjs/common';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { TaskStaff } from '../../domain/entities/task-staff.entity';
  import { CreateTaskStaffInput } from 'src/tasks_staff/domain/interfaces/create-task-staff.input';
  import { TaskRepositoryPort } from 'src/task/domain/ports/task.repository.port';
  import { StaffRepositoryPort } from 'src/staff/domain/ports/staff.repository.port';
  import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
  import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { TaskTypeOrmEntity } from 'src/task/infrastructure/persistence/task.typeorm.entity';
import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { TASK_STAFF_REPOSITORY } from 'src/tasks_staff/domain/token/tasks-staff-repository.token';
  
  @Injectable()
  export class CreateTaskStaffUseCase {
    constructor(
      @Inject(TASK_REPOSITORY)
      private readonly taskRepo: TaskRepositoryPort,
      @Inject(STAFF_REPOSITORY)
      private readonly staffRepo: StaffRepositoryPort,
      @Inject(TASK_STAFF_REPOSITORY)
      private readonly taskStaffRepo: TaskStaffRepositoryPort,
      private readonly mailQueueService: MailQueueService,
    ) {}
  
    async execute(dto: CreateTaskStaffInput, ability: AppAbility): Promise<TaskStaff[]> {
      const task = await this.taskRepo.findById(dto.id_task);
      if (!task) throw new NotFoundException('Tarea no encontrada');
  
      if (!ability.can('create', TaskTypeOrmEntity)) {
        throw new ForbiddenException('No tienes permiso para crear nuevas relaciones tarea-empleados');
      }
  
      const relaciones: TaskStaff[] = [];
  
      for (const staffId of dto.id_staff) {
        const staff = await this.staffRepo.findById(staffId);
        if (!staff) throw new NotFoundException(`Empleado con ID ${staffId} no encontrado`);
  
        const yaExiste = await this.taskStaffRepo.exists(dto.id_task, staffId);
        if (yaExiste) {
          throw new ConflictException(`La relación con el empleado ${staffId} ya existe`);
        }
  
        
        const tareasActivas = await this.taskStaffRepo.findByStaffId(staffId);
        
  
        if (tareasActivas.length >= 3) {
          throw new ConflictException(`El empleado ${staffId} ya tiene 3 tareas activas`);
        }
  
        const relacion = new TaskStaff(
          crypto.randomUUID(),
          dto.id_task,
          staffId
        );
  
        const saved = await this.taskStaffRepo.create(relacion);
        relaciones.push(saved);
  
        await this.mailQueueService.sendMail({
          to: staff.email,
          subject: `Nueva tarea asignada: ${task.title}`,
          text: `Hola ${staff.name}, se te ha asignado una nueva tarea: ${task.title}\n\nDescripción: ${task.description}`,
        });
      }
  
      return relaciones;
    }
  }
  