import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { StaffOrmEntity as StaffSubject } from '../../infrastructure/persistence/staff.orm-entity';
import { Staff } from '../../domain/entities/staff.entity';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';

@Injectable()
export class UpdateClockifyUserIdUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepositoryPort,
  ) {}

  async execute(id: string, clockifyUserId: string, ability: AppAbility): Promise<Staff> {
    const staff = await this.staffRepo.findById(id);
    if (!staff) throw new NotFoundException('Empleado no encontrado');
    if (!ability.can('update', StaffSubject)) throw new ForbiddenException();

    staff.clockifyUserId = clockifyUserId;

    await this.staffRepo.save(staff); // método existente en tu repositorio

    return staff;
  }
}
