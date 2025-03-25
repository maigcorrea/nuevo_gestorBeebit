//PARA ASIGNAR PERSONAS A UNA TAREA
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateTaskStaffDto {
  @ApiProperty({
    description: 'ID de la tarea a la que se asigna el empleado',
    example: 3,
  })
  @IsInt({ message: 'El ID de la tarea debe ser un número entero' })
  @Min(1, { message: 'El ID de la tarea debe ser mayor que 0' })
  id_task: number;



  
  @ApiProperty({
    description: 'ID del empleado asignado a la tarea',
    example: 5,
  })
  @IsInt({ message: 'El ID del empleado debe ser un número entero' })
  @Min(1, { message: 'El ID del empleado debe ser mayor que 0' })
  id_staff: number;
}