import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsDate, IsDateString, IsIn } from 'class-validator';

export class UpdateTaskDto{
    @ApiProperty({
        description:"Titulo de la tarea",
        example:"Hacer funcionalidad de navegación entre páginas",
    })
    @IsString({ message: 'El título debe ser un texto' })
    @Length(2, 100, { message: 'El título debe tener entre 2 y 100 caracteres' })
    title:string;



    @ApiPropertyOptional({
        description: 'Descripción de la tarea',
        example: 'Hacer la navegación con Routes y SPA',
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    @Length(0, 200, { message: 'La descripción no puede exceder los 200 caracteres' })
    description: string;



    @ApiProperty({
        description:"id del proyecto al que está asociada la tarea",
        example:1
    })
    associated_project:number;



    //La fecha de inicio de la tarea no se puede modificar, es la fecha del momento de creación de la tarea


    //Esta fecha se modifica cuando el estado de la tarea cambia a completado o completed
    @ApiProperty({
        description:"Fecha de finalización de la tarea", example:"2025-03-29"
    })
    end_date:Date;



    //EL BOOLEAN SÓLO CAMBIA A TRUE CUANDO EL ESTADO DE LA TAREA CAMBIA A COMPLETADO, POR DEFECTO EN EL MOMENTO DE CREACIÓN DE LA TAREA ES FALSE, CUANDO EL ESTADO CAMBIA A COMPLETADO, ESTE CAMPO CAMBIA A TRUE




    @ApiProperty({
        description: 'Indicador de prioridad de la tarea (high, medium o low)',
        example: "high",
    })
    @IsString()
    @IsOptional()
    //LIMITAR SÓLO A "ALTA, MEDIA, BAJA"
    @IsIn(['high', 'medium', 'low'], {
        message: 'La prioridad debe ser high, medium o low (Alta, media o baja)',
    })
    priority: string;





    @ApiProperty({
        description: 'Indicador de estado de la tarea(pending, active o completed)',
        example: "completed",
    })
    @IsOptional()
    //LIMITAR A PENDIENTE, EN PROGRESO(ACTIVA), FINALIZADA
    @IsIn(['pending', 'active', 'completed'], {
        message: 'El estado debe ser pending, active o completed',
    })
    status: string;
}