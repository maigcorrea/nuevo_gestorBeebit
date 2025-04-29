import { ForbiddenException, Injectable, Inject } from '@nestjs/common';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaffResponseDto } from '../../infrastructure/dto/task-staff-response.dto';
import { TaskStaffOrmEntity } from '../../infrastructure/persistence/task-staff.orm-entity';
import { TaskStaff } from '../../domain/entities/task-staff.entity';
import { TASK_STAFF_REPOSITORY } from 'src/tasks_staff/domain/token/tasks-staff-repository.token';
import { TaskStaffMapper } from 'src/tasks_staff/infrastructure/mappers/task-staff.mapper';
import { StaffType } from 'src/staff/domain/entities/staff.entity';

@Injectable()
export class FindAllTaskStaffUseCase {
  constructor(
    @Inject(TASK_STAFF_REPOSITORY)
    private readonly taskStaffRepo: TaskStaffRepositoryPort
  ) {}

  async execute(ability: AppAbility): Promise<TaskStaffResponseDto[]> {
    const relaciones: TaskStaffOrmEntity[] = await this.taskStaffRepo.findWithRelations();

    if (!ability.can('read', TaskStaffOrmEntity)) {
      throw new ForbiddenException('No tienes permiso para acceder a las relaciones tarea-empleado');
    }

    const permitidas = relaciones.filter(relacion =>
      ability.can('read', {
        ...relacion,
        staff: {
          id: relacion.staff.id,
          name: '',
          email: '',
          register_date: new Date(),
          phone: '',
          password: '',
          profileImage: '',
          type: StaffType.USER,
          resetToken: '',
          resetTokenExpiry: new Date(),
          sentMessages: [],
        },
      })
    );

    //Se mapea taskStaffOrmEntity a TaskStaff
    const tareasDominio = permitidas.map(relacion => TaskStaffMapper.toDomainEntity(relacion));
    return tareasDominio.map(TaskStaffMapper.toResponseDto);
  }
}
