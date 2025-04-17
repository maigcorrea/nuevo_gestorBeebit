import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { ResetPasswordInput } from '../../domain/interfaces/reset-password.input';
import * as bcrypt from 'bcryptjs';
import { Staff } from '../../domain/entities/staff.entity';

export class ResetPasswordUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(input: ResetPasswordInput, ability: any): Promise<{ message: string }> {
    if (!ability.can('update', Staff)) {
      throw new ForbiddenException('No tienes permiso para modificar la contraseña');
    }

    const user = await this.staffRepo.findByToken(input.token);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.staffRepo.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
