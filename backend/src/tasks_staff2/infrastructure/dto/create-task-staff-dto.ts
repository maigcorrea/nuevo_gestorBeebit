import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskStaffDto {
  @ApiProperty({
    description: 'ID de la tarea a la que se asignan los empleados',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  @IsUUID()
  id_task: string;

  @ApiProperty({
    description: 'Lista de IDs de los empleados que serán asignados a la tarea',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => String)
  @IsUUID('all', { each: true })
  id_staff: string[];
}
