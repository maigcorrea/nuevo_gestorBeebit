import { ApiProperty } from '@nestjs/swagger';
import { IsString, } from 'class-validator';

export class TaskResponseDto{
    @ApiProperty({
        description:"ID de la tarea", example:1,
    })
    id:number;


    @ApiProperty({
        description:"Título de la tarea", example:"Comprobar funcionalidad de carrito de compra"
    })
    title:string;


    @ApiProperty({
        description:"Descripción del proyecto", example:"Comprobar si almacena los productos tras pulsar el botón de Añadir"
    })
    description:string;



    //DEVUELVO EL PROYECTO O SÓLO EL ID?????
    @ApiProperty({
        description:"id del proyecto al que está asociada la tarea",
        example:1
    })
    associated_project:number;



    @ApiProperty({
        description:"Fecha de inicio", example:"2025-03-22"
    })
    start_date:Date;



    @ApiProperty({
        description:"Fecha de finalización", example:"2025-03-29"
    })
    end_date:Date;



    @ApiProperty({
            description: 'Indicador de si la tarea se ha completado o no (Boolean)',
            example: true,
    })
    completed: boolean;



    @ApiProperty({
        description:"Prioridad de la tarea", example:"high"
    })
    priority:string;



    @ApiProperty({
        description:"Estado en el que se encuentra la tarea", example:"pending"
    })
    status:string;
}