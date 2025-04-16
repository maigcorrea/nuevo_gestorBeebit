import { IsString, MinLength, IsUUID } from 'class-validator';
import { ChangePasswordInput } from '../../domain/interfaces/change-password.input';

export class ChangePasswordDto implements ChangePasswordInput {
  @IsUUID()
  userId: string;

  @IsString()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}
