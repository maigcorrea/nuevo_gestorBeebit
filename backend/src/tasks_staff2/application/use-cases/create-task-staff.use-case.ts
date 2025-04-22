import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { TaskStaff } from '../../domain/entities/task-staff.entity';
  import { CreateTaskStaffInput } from 'src/tasks_staff2/domain/interfaces/create-task-staff.input';
  import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
  import { StaffRepositoryPort } from 'src/staff2/domain/ports/staff.repository.port';
  import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
  import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
  
  @Injectable()
  export class CreateTaskStaffUseCase {
    constructor(
      private readonly taskRepo: TaskRepositoryPort,
      private readonly staffRepo: StaffRepositoryPort,
      private readonly taskStaffRepo: TaskStaffRepositoryPort,
      private readonly mailQueueService: MailQueueService,
    ) {}
  
    async execute(dto: CreateTaskStaffInput, ability: AppAbility): Promise<TaskStaff[]> {
      const task = await this.taskRepo.findById(dto.id_task);
      if (!task) throw new NotFoundException('Tarea no encontrada');
  
      if (!ability.can('create', task)) {
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
  