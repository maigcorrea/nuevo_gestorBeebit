import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty({
        description: 'Dirección de correo del destinatario',
        example: 'usuario@empresa.com',
    })
    @IsEmail()
    @IsNotEmpty()
    to: string;

    @ApiProperty({
        description: 'Asunto del mensaje',
        example: 'Reunión de equipo',
    })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({
        description: 'Contenido del mensaje',
        example: 'Hola equipo, recuerden la reunión a las 10:00.',
    })
    @IsString()
    @IsNotEmpty()
    text: string;
}