import { ForbiddenException } from '@nestjs/common';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { Staff } from '../../domain/entities/staff.entity';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { StaffMapper } from 'src/staff2/infrastructure/mappers/staff.mapper';
import { StaffOrmEntity as StaffSubject } from 'src/staff2/infrastructure/persistence/staff.orm-entity';
import { StaffResponseDto } from 'src/staff2/infrastructure/dto/staff-response.dto';

export class FindAllStaffUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(ability: AppAbility): Promise<StaffResponseDto[]> {
    if (!ability.can('read', StaffSubject)) {
      throw new ForbiddenException('No tienes permiso para ver los empleados');
    }

    const allStaff = await this.staffRepo.findAll();
    return allStaff.map(StaffMapper.toResponseDto);
  }
}
