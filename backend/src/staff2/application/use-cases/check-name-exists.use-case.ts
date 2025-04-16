import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';

export class CheckNameExistsUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(name: string): Promise<boolean> {
    const staff = await this.staffRepo.findByName(name);
    return !!staff;
  }
}
