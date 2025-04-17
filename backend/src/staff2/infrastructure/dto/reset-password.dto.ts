import { IsString, Length, Matches, IsNotEmpty } from 'class-validator';
import { ResetPasswordInput } from '../../domain/interfaces/reset-password.input';

export class ResetPasswordDto implements ResetPasswordInput {
  @IsString()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  newPassword: string;
}
