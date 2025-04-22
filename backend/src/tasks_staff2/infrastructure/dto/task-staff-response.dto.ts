import { ApiProperty } from '@nestjs/swagger';

export class TaskStaffResponseDto {
  @ApiProperty({
    description: 'ID de la relación tarea-empleado',
    example: '38cbfcfa-6b2e-4a4a-8d6b-d26541e7a60f',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la tarea asignada',
    example: '6b203f84-37de-4cf6-8b8f-2d7be43c44d3',
  })
  taskId: string;

  @ApiProperty({
    description: 'ID del empleado asignado',
    example: '28e7f284-21c0-4705-85c0-1b10f9c3b1a4',
  })
  staffId: string;
}
