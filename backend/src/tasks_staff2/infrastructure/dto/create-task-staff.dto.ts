import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';
import { CreateTaskStaffInput } from 'src/tasks_staff2/domain/interfaces/create-task-staff.input';

export class CreateTaskStaffDto implements CreateTaskStaffInput {
  @ApiProperty({
    description: 'ID de la tarea a la que se asignan los empleados',
    example: '9f4a0a91-781c-4d58-8c18-3b9ea3f3b123',
  })
  @IsUUID()
  id_task: string;

  @ApiProperty({
    description: 'Lista de IDs de los empleados asignados a la tarea',
    example: ['c4d86bc1-9c1f-4f85-b20f-b847e95fbb6e'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  id_staff: string[];
}
