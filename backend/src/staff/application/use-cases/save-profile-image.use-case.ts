import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { SaveProfileImageInput } from '../../domain/interfaces/save-profile-image.input';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { StaffOrmEntity as StaffSubject } from 'src/staff/infrastructure/persistence/staff.orm-entity';

export class SaveProfileImageUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(input: SaveProfileImageInput, ability: AppAbility): Promise<void> {
    const user = await this.staffRepo.findById(input.userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (!ability.can('update', StaffSubject)) {
      throw new ForbiddenException('No tienes permiso para modificar esta imagen');
    }

    user.profileImage = input.imageUrl;
    await this.staffRepo.save(user);
  }
}
