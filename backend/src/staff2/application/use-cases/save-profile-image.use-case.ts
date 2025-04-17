import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { SaveProfileImageInput } from '../../domain/interfaces/save-profile-image.input';
import { NotFoundException } from '@nestjs/common';

export class SaveProfileImageUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(input: SaveProfileImageInput): Promise<void> {
    const user = await this.staffRepo.findById(input.userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.profileImage = input.imageUrl;

    await this.staffRepo.save(user);
  }
}
