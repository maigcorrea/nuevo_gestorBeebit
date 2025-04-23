import { ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ChangePasswordInput } from '../../domain/interfaces/change-password.input';
import { StaffOrmEntity as StaffSubject } from 'src/staff/infrastructure/persistence/staff.orm-entity';

export class ChangePasswordUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(input: ChangePasswordInput, ability: AppAbility): Promise<boolean> {
    if (!ability.can('update', StaffSubject)) {
      throw new ForbiddenException('No tienes permiso para cambiar la contraseña');
    }

    const staff = await this.staffRepo.findById(input.userId);
    if (!staff) {
      throw new NotFoundException('El usuario no existe');
    }

    const hashed = await bcrypt.hash(input.newPassword, 10);
    staff.password = hashed;

    await this.staffRepo.save(staff);
    return true;
  }
}
