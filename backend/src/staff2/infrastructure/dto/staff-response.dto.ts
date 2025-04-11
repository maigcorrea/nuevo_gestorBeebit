import { ApiProperty } from "@nestjs/swagger";
import { StaffType } from "../../domain/entities/staff.entity";

export class StaffResponseDto{
    @ApiProperty({
        description: 'ID del empleado', example:'e1b2c3d4-1234-5678-9876-abcd1234efgh'
    })
    id:string;

    @ApiProperty({
        description: 'Nombre del empleado', example:'Juan Pérez'
    })
    name:string;

    @ApiProperty({
        description: 'Correo elecrónico del empleado', example:'juanperez@gmail.com'
    })
    email:string;


    @ApiProperty({
        description:"Fecha de registro del empleado en el sistema", example:"2025-02-20T00:00:00.000Z"
    })
    register_date:Date;



    @ApiProperty({
        description:"Teléfono del empleado", example:"682543621"
    })
    phone:string;



    @ApiProperty({
        description: 'Tipo de usuario: admin o user',
        enum: StaffType,
        example: StaffType.USER,
    })
    type: StaffType;


    //La contraseña no la devolvemos en la respuesta
}