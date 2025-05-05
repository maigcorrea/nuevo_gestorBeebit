import { ApiProperty } from '@nestjs/swagger';

export class StartTimeEntryDto {
  @ApiProperty({ example: 'uuid-del-empleado', description: 'ID del empleado (staffId)' })
  staffId: string;

  @ApiProperty({ example: 'uuid-de-la-tarea', description: 'ID de la tarea (taskId)' })
  taskId: string;
}