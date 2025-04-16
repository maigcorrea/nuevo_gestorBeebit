import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { VerifyPasswordInput } from 'src/staff2/domain/interfaces/verify-password.input';
import * as bcrypt from 'bcryptjs';

export class VerifyPasswordUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(input: VerifyPasswordInput): Promise<boolean> {
    const staff = await this.staffRepo.findByIdWithPassword(input.userId);

    if (!staff || !staff.password) return false;

    return bcrypt.compare(input.password, staff.password);
  }
}
