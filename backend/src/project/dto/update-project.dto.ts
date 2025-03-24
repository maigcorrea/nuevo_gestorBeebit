import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsDate, IsDateString, IsIn } from 'class-validator';
 
export class UpdateProjectDto{
    @ApiProperty({
        description:"Titulo del proyecto",
        example:"Sistema de reservas online",
    })
    @IsString({ message: 'El título debe ser un texto' })
    @Length(2, 100, { message: 'El título debe tener entre 2 y 100 caracteres' })
    title:string;



    @ApiPropertyOptional({
        description: 'Descripción del proyecto',
        example: 'Aplicación para gestionar reservas de hoteles',
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    @Length(0, 200, { message: 'La descripción no puede exceder los 200 caracteres' })
    description: string;




    @ApiPropertyOptional({
        description: 'Fecha de inicio del proyecto',
        example: '2025-04-01',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener formato ISO (YYYY-MM-DD)' })
    start_date: string;




    @ApiPropertyOptional({
        description: 'Fecha límite de entrega del proyecto',
        example: '2025-05-31',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha límite debe tener formato ISO (YYYY-MM-DD)' })
    deadline: string;
    




    @ApiPropertyOptional({
        description: 'Estado del proyecto',
        example: 'active',
      })
    @IsOptional()
    @IsString()
    @IsIn(['pending', 'active', 'paused', 'completed'], {
    message: 'El estado debe ser uno de: pending, active, paused, completed',
    })
    status: string;

}