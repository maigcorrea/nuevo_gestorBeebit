import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto{
    @ApiProperty({
        description: 'ID del usuario',
    })
    id:number;

    @ApiProperty({
        description: 'Nombre del usuario'
    })
    name:string;

    @ApiProperty({
        description: 'Correo elecrónico del usuario'
    })
    email:string;
}