import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length, Matches, IsDateString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { StaffType } from '../../domain/entities/staff.entity';
import { CreateStaffInput } from '../../domain/interfaces/create-staff.input';

export class CreateStaffDto implements CreateStaffInput{
    @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
    @IsString()
    @Length(2, 100)
    @IsNotEmpty()
    name: string;



    @ApiProperty({ description: 'Correo electrónico', example: 'juan@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;



    @ApiPropertyOptional({
        description: 'Fecha de registro (ISO)',
        example: '2025-02-20',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' })
    register_date?: Date;



    
    @ApiProperty({
        description:"Teléfono del empleado",
        example:"682543621"
    })
    @IsNotEmpty()
    @Length( 9, 9, { message: 'Un número de teléfono debe tener 9 números' })
    @Matches(/^\d+$/, { message: 'El teléfono solo debe contener números' })
    phone:string;




    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'holaMundo_2',
    })
    @IsString()
    @IsNotEmpty()
    @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
    })
    password: string;


    //Si el cliente no envía el campo type, se guarda como 'user' (por defecto en la entidad). Si el cliente sí lo envía, se valida y se guarda correctamente como 'admin' o 'user'.
    @ApiPropertyOptional({
        description: 'Tipo de usuario: admin o user',
        enum: StaffType,
        example: StaffType.USER,
    })
    @IsOptional()
    @IsEnum(StaffType, { message: 'El tipo debe ser admin o user' })
    type?: StaffType;
}
