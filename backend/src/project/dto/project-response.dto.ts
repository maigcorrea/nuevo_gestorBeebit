import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class ProjectResponseDto{
    @ApiProperty({
        description:"ID del proyecto", example:1,
    })
    id:string;


    @ApiProperty({
        description:"Título del proyecto", example:"Tienda online"
    })
    title:string;


    @ApiProperty({
        description:"Descripción del proyecto", example:"Tienda dedicada al comercio online al por mayor"
    })
    description:string;


    @IsString()
    @ApiProperty({
        description:"Fecha de inicio", example:"2025-03-22"
    })
    start_date:Date | null;


    @IsString()
    @ApiProperty({
        description:"Fecha de entrega", example:"2025-06-29"
    })
    deadline:Date | null;

    
    @IsString()
    @ApiProperty({
        description:"Última actualización del proyecto", example:"2025-03-23"
    })
    last_update:Date | null;


    @ApiProperty({
        description:"Estado del proyecto", example:"paused"
    })
    status:ProjectStatus;


    @ApiPropertyOptional({
        description: 'URL pública al documento adjunto del proyecto',
        example: 'http://localhost:9000/archivos/projects/manual.pdf',
    })
    document_url?: string;
}