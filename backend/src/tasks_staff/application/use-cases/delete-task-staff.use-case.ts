import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { DeleteTaskStaffInput } from 'src/tasks_staff/domain/interfaces/delete-task-staff.input';
  import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
  import { TaskStaffMapper } from 'src/tasks_staff/infrastructure/mappers/task-staff.mapper';
  import { Inject } from '@nestjs/common';
  import { TASK_STAFF_REPOSITORY } from 'src/tasks_staff/domain/token/tasks-staff-repository.token';

  @Injectable()
  export class DeleteTaskStaffUseCase {
    constructor(
      @Inject(TASK_STAFF_REPOSITORY)
      private readonly taskStaffRepo: TaskStaffRepositoryPort,
    ) {}
  
    async execute(dto: DeleteTaskStaffInput, ability: AppAbility): Promise<string> {
      const relacion = await this.taskStaffRepo.findOneByTaskAndStaff(dto.id_task, dto.id_staff);
  
      if (!relacion) {
        throw new NotFoundException('Relación no encontrada');
      }

      
       // CASL necesita la entidad ORM
      if (!ability.can('delete', relacion)) {
        throw new ForbiddenException('No tienes permiso para eliminar esta relación');
      }
  
        //  El repositorio espera la entidad de dominio
        const relacionDominio = TaskStaffMapper.toDomainEntity(relacion);

        await this.taskStaffRepo.remove(relacionDominio);
      return 'Relación eliminada correctamente';
    }
  }
  