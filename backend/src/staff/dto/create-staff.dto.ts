import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length, Matches, IsDateString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { StaffType } from '../entities/staff.entity';


export class CreateStaffDto{
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Pérez',
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    @IsNotEmpty()
    name: string;



    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juanperez@gmail.com',
    })
    @IsEmail({}, { message: 'El email no es válido' })
    @IsNotEmpty()
    email: string;



    //register_date SE ESTABLECE AUTOMÁTICAMENTE AL CREAR UN USUARIO A LA FECHA DE ESE DÍA
    @ApiPropertyOptional({
        description: "Fecha de registro en el sistema",
        example: "2025-02-20"
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' })
    register_date:Date




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
