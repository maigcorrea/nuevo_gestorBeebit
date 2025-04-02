import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsDate, IsDateString, IsIn, IsBoolean } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto{
    @ApiProperty({
        description:"Título de la tarea",
        example:"Completar test con Jest"
    })
    @IsNotEmpty()
    @IsString({message: "El título del proyecto debe ser un texto"})
    @Length(1, 100, {message:"El título de la tarea debe tener entre 1 y 100 caracteres"})
    title:string;


    @IsOptional()
    @ApiPropertyOptional({
        description:"Descripción de la tarea",
        example:"Hay que hacer test sobre la funcionalidad de compra del carrito de la tienda online"
    })
    @IsString({message:"La descripción de la tarea debe ser un texto"})
    @Length(0, 200, {message:"La descripción de la tarea puede tener un máximo de 200 caracteres"})
    description:string;


    @IsNotEmpty()
    @ApiProperty({
        description:"id del proyecto al que está asociada la tarea",
        example:1
    })
    associated_project:string;


    @IsOptional()
    @ApiPropertyOptional({
        description: 'Fecha de inicio de la tarea',
        example: '2025-03-23', // formato ISO
    })
    @IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' })
    //LA FECHA DE INICIO DE LA TAREA ES LA FECHA EN LA QUE FUE CREADA, EN EL MOMENTO DE CREACIÓN, ESTE CAMPO SE RELLENA CON LA FECHA DE ESE DÍA
    start_date: string;


    //LA FECHA DE FINALIZACIÓN DE LA TAREA ES LA FECHA EN LA QUE EL ESTADO CAMBIA A COMPLETADO, CUANDO EL ESTADO CAMBIA A COMPLETADO, ESTE CAMPO SE RELLENA CON LA FECHA DE ESE DÍA
    //POR ESO, POR DEFECTO, AL CREAR LA TAREA ESTÁ A NULL
    //@ApiPropertyOptional({
       // description: 'Fecha de finalización de la tarea',
        //example: '2025-03-23', // formato ISO
    //})
    //@IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' })
    //@IsOptional()
    //end_date: string;


    //EL BOOLEAN SÓLO CAMBIA A TRUE CUANDO EL ESTADO DE LA TAREA CAMBIA A COMPLETADO, POR DEFECTO EN EL MOMENTO DE CREACIÓN DE LA TAREA ES FALSE, CUANDO EL ESTADO CAMBIA A COMPLETADO, ESTE CAMPO CAMBIA A TRUE
    //POR ESO, POR DEFECTO, AL CREAR LA TAREA ESTÁ A NULL
    //@ApiProperty({
        //description: 'Indicador de si la tarea se ha completado o no (Boolean)',
        //example: true,
    //})
    //@IsBoolean()
    //EL BOOLEAN SÓLO CAMBIA A TRUE CUANDO EL ESTADO DE LA TAREA CAMBIA A COMPLETADO, POR DEFECTO EN EL MOMENTO DE CREACIÓN DE LA TAREA ES FALSE, CUANDO EL ESTADO CAMBIA A COMPLETADO, ESTE CAMPO CAMBIA A TRUE
    //completed: boolean;



    @ApiProperty({
        description: 'Indicador de prioridad de la tarea (high, medium o low)',
        example: "high",
    })
    @IsString()
    //LIMITAR SÓLO A "ALTA, MEDIA, BAJA"
    @IsIn(['high', 'medium', 'low'], {
        message: 'La prioridad debe ser high, medium o low (Alta, media o baja)',
    })
    priority: TaskPriority;



    //POR DEFECTO, AL CREAR UNA TAREA, EL ESTADO ESTÁ PENDING (SE CONTROLA EN SERVICE)
    //@ApiPropertyOptional({
        //description: 'Indicador de estado de la tarea(pending, active o completed)',
        //example: "completed",
    //})
    //LIMITAR A PENDIENTE, EN PROGRESO(ACTIVA), FINALIZADA
    //@IsOptional()
    //@IsIn(['pending', 'active', 'completed'], {
        //message: 'El estado debe ser pending, active o completed',
    //})
    //status: string;

}