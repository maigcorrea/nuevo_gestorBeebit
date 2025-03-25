import { ApiProperty } from "@nestjs/swagger";

export class StaffResponseDto{
    @ApiProperty({
        description: 'ID del empleado', example:1
    })
    id:number;

    @ApiProperty({
        description: 'Nombre del empleado', example:'Juan Pérez'
    })
    name:string;

    @ApiProperty({
        description: 'Correo elecrónico del empleado', example:'juanperez@gmail.com'
    })
    email:string;


    @ApiProperty({
        description:"Fecha de registro del empleado en el sistema", example:"2025-02-20"
    })
    register_date:Date;



    @ApiProperty({
        description:"Teléfono del empleado", example:"682543621"
    })
    phone:string;


    //La contraseña no la devolvemos en la respuesta
}