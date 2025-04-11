import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsDate, IsDateString, IsIn, IsEmail, MinLength, IsEnum } from 'class-validator';
import { StaffType } from '../../staff2/domain/entities/staff.entity';

export class UpdateStaffDto{
    //TODOS LOS CAMPOS SON OPCIONALES PORQUE PUEDEN MODIFICARSE O NO, SI NO SE MODIFICAN O NO SE INTRODUCE NADA, SE QUEDA EL VALOR ANTERIOR
    //El nombre del usuario no se puede modificar



    @ApiPropertyOptional({
        description: 'Correo electrónico del usuario',
        example: 'juanperez@gmail.com',
    })
    @IsEmail({}, { message: 'El email no es válido' })
    @IsOptional()
    email: string;



    //La fecha de registro del usuario en el sistema no se puede modificar



    @ApiPropertyOptional({
        description:"Teléfono del empleado",
        example:"682543621"
    })
    @IsOptional()
    @Length( 9, 9, { message: 'Un número de teléfono debe tener 9 números' })
    @Matches(/^\d+$/, { message: 'El teléfono solo debe contener números' })
    phone:string;



    //NO se puede modificar la contraseña en conjunto a los otros valores, es decir, la contraseña sólo se puede modificar ella específicamente si el usuario pincha un botón de cambiar contraseña
    @ApiPropertyOptional({
        description: 'Contraseña del usuario',
        example: 'holaMundo._1',
    })
    @IsString()
    @IsOptional()
    @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
    })
    password: string;




    // Tipo de usuario (rol): admin o user
    @ApiPropertyOptional({
        description: 'Tipo de usuario: admin o user',
        enum: StaffType,
        example: StaffType.USER,
    })
    @IsOptional()
    @IsEnum(StaffType, { message: 'El tipo debe ser admin o user' })
    type: StaffType;
}