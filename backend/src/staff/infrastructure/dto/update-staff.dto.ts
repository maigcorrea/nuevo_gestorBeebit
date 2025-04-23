import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  Length,
  Matches,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { StaffType } from '../../domain/entities/staff.entity';
import { UpdateStaffInput } from '../../domain/interfaces/update-staff.input';

export class UpdateStaffDto implements UpdateStaffInput {
  // El nombre no se puede modificar, por eso no aparece aquí

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'juanperez@gmail.com',
  })
  @IsEmail({}, { message: 'El email no es válido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del empleado',
    example: '682543621',
  })
  @IsOptional()
  @Length(9, 9, { message: 'Un número de teléfono debe tener 9 números' })
  @Matches(/^\d+$/, { message: 'El teléfono solo debe contener números' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Contraseña del usuario',
    example: 'holaMundo._1',
  })
  @IsString()
  @IsOptional()
  @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Tipo de usuario: admin o user',
    enum: StaffType,
    example: StaffType.USER,
  })
  @IsOptional()
  @IsEnum(StaffType, { message: 'El tipo debe ser admin o user' })
  type?: StaffType;
}
