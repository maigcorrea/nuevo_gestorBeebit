import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';

export class CheckEmailExistsUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(email: string): Promise<boolean> {
    const staff = await this.staffRepo.findByEmail(email);
    return !!staff;
  }
}
