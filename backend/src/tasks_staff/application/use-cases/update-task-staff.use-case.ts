import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { UpdateTaskStaffInput } from 'src/tasks_staff/domain/interfaces/update-task-staff.input';
  import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
  import { TaskRepositoryPort } from 'src/task/domain/ports/task.repository.port';
  import { StaffRepositoryPort } from 'src/staff/domain/ports/staff.repository.port';
  import { TaskMapper } from 'src/task/infrastructure/mappers/task.mapper';
  import { StaffMapper } from 'src/staff/infrastructure/mappers/staff.mapper';
  import { TaskStaffMapper } from 'src/tasks_staff/infrastructure/mappers/task-staff.mapper';
  
  @Injectable()
  export class UpdateTaskStaffUseCase {
    constructor(
      private readonly taskStaffRepo: TaskStaffRepositoryPort,
      private readonly taskRepo: TaskRepositoryPort,
      private readonly staffRepo: StaffRepositoryPort,
    ) {}
  
    async execute(input: UpdateTaskStaffInput, ability: AppAbility) {
      const relacion = await this.taskStaffRepo.findOneByTaskAndStaff(
        input.old_task_id,
        input.old_staff_id
      );
  
      if (!relacion) {
        throw new NotFoundException('Relación no encontrada');
      }
  
      if (!ability.can('update', relacion)) {
        throw new ForbiddenException('No tienes permiso para modificar esta relación');
      }
  
      if (input.new_task_id) {
        const nuevaTarea = await this.taskRepo.findById(input.new_task_id);
        if (!nuevaTarea) throw new NotFoundException('Tarea no encontrada');
        const nuevaTareaOrm = TaskMapper.toOrmEntity(nuevaTarea);
        relacion.task = nuevaTareaOrm;
      }
  
      if (input.new_staff_id) {
        const nuevoStaff = await this.staffRepo.findById(input.new_staff_id);
        if (!nuevoStaff) throw new NotFoundException('Empleado no encontrado');
        const nuevoStaffOrm = StaffMapper.toOrmEntity(nuevoStaff);
        relacion.staff = nuevoStaffOrm;
      }
  
      const relacionDominio = TaskStaffMapper.toDomainEntity(relacion);
      return await this.taskStaffRepo.update(relacionDominio);

    }
  }
  