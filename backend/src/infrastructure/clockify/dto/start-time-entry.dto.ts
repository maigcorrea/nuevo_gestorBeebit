import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartTimeEntryDto {
  @ApiProperty({ example: 'uuid-del-empleado', description: 'ID del empleado (staffId)' })
  @IsString()
  staffId: string;

  @ApiProperty({ example: 'uuid-de-la-tarea', description: 'ID de la tarea (taskId)' })
  @IsString()
  taskId: string;
}