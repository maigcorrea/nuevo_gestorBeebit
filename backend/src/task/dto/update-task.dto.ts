import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsDate, IsDateString, IsIn } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto{
    //Todos los campos deberían ser opcionales, porque puede que quieras actualizar solo uno de ellos.

    @ApiPropertyOptional({
        description:"Titulo de la tarea",
        example:"Hacer funcionalidad de navegación entre páginas",
    })
    @IsOptional()
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


    // No se puede asignar otro proyecto diferente a la tarea. Si una tarea pertenece a un proyecto, no cambia a menos que se elimine y se cree otra.
    //@ApiPropertyOptional({
        //description:"id del proyecto al que está asociada la tarea",
        //example:1
    //})
    //@IsOptional()
    //associated_project:number;



    //La fecha de inicio de la tarea no se puede modificar, es la fecha del momento de creación de la tarea


    //Esta fecha se modifica cuando el estado de la tarea cambia a completado o completed
    //@ApiProperty({
        //description:"Fecha de finalización de la tarea", example:"2025-03-29"
    //})
    //end_date:Date;



    //EL BOOLEAN SÓLO CAMBIA A TRUE CUANDO EL ESTADO DE LA TAREA CAMBIA A COMPLETADO, POR DEFECTO EN EL MOMENTO DE CREACIÓN DE LA TAREA ES FALSE, CUANDO EL ESTADO CAMBIA A COMPLETADO, ESTE CAMPO CAMBIA A TRUE




    @ApiPropertyOptional({
        description: 'Indicador de prioridad de la tarea (high, medium o low)',
        example: "high",
    })
    @IsString()
    @IsOptional()
    //LIMITAR SÓLO A "ALTA, MEDIA, BAJA"
    @IsIn(['high', 'medium', 'low'], {
        message: 'La prioridad debe ser high, medium o low (Alta, media o baja)',
    })
    priority: TaskPriority;





    @ApiPropertyOptional({
        description: 'Indicador de estado de la tarea(pending, active o completed)',
        example: "completed",
    })
    @IsOptional()
    //LIMITAR A PENDIENTE, EN PROGRESO(ACTIVA), FINALIZADA
    @IsIn(['pending', 'active', 'completed'], {
        message: 'El estado debe ser pending, active o completed',
    })
    status: TaskStatus;
}