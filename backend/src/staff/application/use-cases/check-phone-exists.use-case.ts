import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';

export class CheckPhoneExistsUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(phone: string): Promise<boolean> {
    const staff = await this.staffRepo.findByPhone(phone);
    return !!staff;
  }
}
