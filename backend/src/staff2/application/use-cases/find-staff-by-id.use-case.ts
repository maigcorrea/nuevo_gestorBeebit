import { NotFoundException } from '@nestjs/common';
import { Staff } from '../../domain/entities/staff.entity';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';

export class FindStaffByIdUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(id: string): Promise<Staff> {
    const staff = await this.staffRepo.findById(id);

    if (!staff) {
      throw new NotFoundException(`No se encontró el empleado con id ${id}`);
    }

    return staff;
  }
}
