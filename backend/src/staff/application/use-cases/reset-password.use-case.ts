import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { BadRequestException, Inject } from '@nestjs/common';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { ResetPasswordInput } from '../../domain/interfaces/reset-password.input';
import * as bcrypt from 'bcryptjs';


export class ResetPasswordUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepositoryPort) {}

  async execute(input: ResetPasswordInput): Promise<{ message: string }> {

    // 1. Buscar el usuario por el token de recuperación
    const user = await this.staffRepo.findByToken(input.token);


    // 2. Verificar si el token ha expirado
    if (!user) {
      throw new BadRequestException('Token inválido.');
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date) {
      throw new BadRequestException('Token expirado. Solicita uno nuevo');
    }


    // 3. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    // 4. Actualizar los datos
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    // 5. Guardar los cambios
    await this.staffRepo.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
