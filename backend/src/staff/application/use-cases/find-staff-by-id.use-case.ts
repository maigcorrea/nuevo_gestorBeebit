import { NotFoundException } from '@nestjs/common';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { StaffResponseDto } from '../../infrastructure/dto/staff-response.dto';
import { StaffMapper } from '../../infrastructure/mappers/staff.mapper';

export class FindStaffByIdUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(id: string): Promise<StaffResponseDto> {
    const staff = await this.staffRepo.findById(id);

    if (!staff) {
      throw new NotFoundException(`No se encontró el empleado con id ${id}`);
    }

    return StaffMapper.toResponseDto(staff);
  }
}
