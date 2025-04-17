import { IsEmail } from 'class-validator';
import { HandleForgotPasswordInput } from '../../domain/interfaces/handle-forgot-password.input';

export class ForgotPasswordDto implements HandleForgotPasswordInput {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;
}
