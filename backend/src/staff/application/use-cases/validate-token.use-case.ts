import { Inject, BadRequestException } from '@nestjs/common';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { StaffRepositoryPort } from 'src/staff/domain/ports/staff.repository.port';

export class ValidateTokenUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepositoryPort,
  ) {}

  async execute(token: string): Promise<{ valid: boolean }> {
    const user = await this.staffRepo.findByToken(token);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    return { valid: true };
  }
}
