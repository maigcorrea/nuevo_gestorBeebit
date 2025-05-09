// /directus/staff/dto/create-staff.dto.ts

import { IsEmail, IsString, IsIn, MinLength } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @MinLength(6)
  password: string;

  @IsIn(['admin', 'user'])
  type: 'admin' | 'user';
}
