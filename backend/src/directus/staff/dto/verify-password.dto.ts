import { IsEmail, IsString } from 'class-validator';

export class VerifyPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}