import { IsNumber, IsString, Length, Matches, IsNotEmpty, IsUUID } from 'class-validator';
import { VerifyPasswordInput } from 'src/staff2/domain/interfaces/verify-password.input';

export class VerifyPasswordDto implements VerifyPasswordInput {
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
    })
  password: string;
}