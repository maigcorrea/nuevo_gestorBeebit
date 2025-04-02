//PARA ASIGNAR PERSONAS A UNA TAREA
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskStaffDto {
  @ApiProperty({
    description: 'ID de la tarea a la que se asigna el empleado',
    example: 3,
  })
  @IsUUID()
  id_task: string;



  
  @ApiProperty({
    description: 'ID del empleado asignado a la tarea',
    example: 5,
  })

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => String)
  @IsUUID("all", { each: true })
  id_staff: string[]; //Array de ids
}