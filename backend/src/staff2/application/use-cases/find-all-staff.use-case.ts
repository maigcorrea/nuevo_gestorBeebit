import { ForbiddenException } from '@nestjs/common';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { Staff } from '../../domain/entities/staff.entity';
import { AppAbility } from 'src/casl/casl-ability.factory';

export class FindAllStaffUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(ability: AppAbility): Promise<Staff[]> {
    if (!ability.can('read', Staff)) {
      throw new ForbiddenException('No tienes permiso para ver los empleados');
    }

    return await this.staffRepo.findAll();
  }
}
