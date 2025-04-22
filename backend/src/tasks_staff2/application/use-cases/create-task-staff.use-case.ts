import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';
  import { TaskStaff } from 'src/tasks_staff2/domain/entities/task-staff.entity';
  import { TaskStaffRepositoryPort } from 'src/tasks_staff2/domain/ports/task-staff.repository.port';
  import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
  import { StaffRepositoryPort } from 'src/staff2/domain/ports/staff.repository.port';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { CreateTaskStaffInput } from 'src/tasks_staff2/domain/interfaces/create-task-staff.input';
  import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
  import { TaskStaffOrmEntity as TaskStaffSubject } from 'src/tasks_staff2/infrastructure/persistence/task-staff.typeorm.entity';
  
  export class CreateTaskStaffUseCase {
    constructor(
      private readonly taskRepo: TaskRepositoryPort,
      private readonly staffRepo: StaffRepositoryPort,
      private readonly taskStaffRepo: TaskStaffRepositoryPort,
      private readonly mailQueueService: MailQueueService,
    ) {}
  
    async execute(input: CreateTaskStaffInput, ability: AppAbility): Promise<TaskStaff[]> {
      const task = await this.taskRepo.findById(input.id_task);
      if (!task) {
        throw new NotFoundException('Tarea no encontrada');
      }
  
      if (!ability.can('create', TaskStaffSubject)) {
        throw new ForbiddenException('No tienes permiso para crear nuevas relaciones tarea-empleados');
      }
  
      const relaciones: TaskStaff[] = [];
  
      for (const staffId of input.id_staff) {
        const staff = await this.staffRepo.findById(staffId);
        if (!staff) {
          throw new NotFoundException(`Empleado con ID ${staffId} no encontrado`);
        }
  
        const yaExiste = await this.taskStaffRepo.findByTaskId(task.id);
        if (yaExiste.some(r => r.staffId === staff.id)) {
          throw new ConflictException(`La relación con el empleado ${staffId} ya existe`);
        }
  
        const relacionesActuales = await this.taskStaffRepo.findByStaffId(staffId);
        const tareasActivas = relacionesActuales.filter(
          (rel) => rel.taskId && task.status === 'active',
        );
  
        if (tareasActivas.length >= 3) {
          throw new ConflictException(`El empleado ${staffId} ya tiene 3 tareas activas`);
        }
  
        const nuevaRelacion = new TaskStaff(
          crypto.randomUUID(),
          task.id,
          staff.id,
        );
  
        const saved = await this.taskStaffRepo.create(nuevaRelacion);
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
  