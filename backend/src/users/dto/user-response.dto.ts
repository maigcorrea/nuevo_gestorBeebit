import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto{
    @ApiProperty({
        description: 'ID del usuario', example:1
    })
    id:number;

    @ApiProperty({
        description: 'Nombre del usuario', example:'Juan Pérez'
    })
    name:string;

    @ApiProperty({
        description: 'Correo elecrónico del usuario', example:'juanperez@gmail.com'
    })
    email:string;
}