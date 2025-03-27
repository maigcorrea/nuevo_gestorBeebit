import { ApiProperty } from '@nestjs/swagger';

export class TaskByUserResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la tarea' })
  id: number;

  @ApiProperty({ example: 'Redactar informe mensual' })
  title: string;

  @ApiProperty({ example: 'Revisión y entrega del informe al cliente final' })
  description: string;

  @ApiProperty({ example: '2025-03-01', description: 'Fecha de inicio de la tarea' })
  start_date: Date;

  @ApiProperty({ example: '2025-03-27', description: 'Fecha de finalización' })
  end_date: Date | null;

  @ApiProperty({ example: 'completed', description: 'Estado de la tarea' })
  status: string;

  @ApiProperty({ example: true, description: 'Indica si la tarea ha sido completada' })
  completed: boolean;

  @ApiProperty({ example: 'alta', description: 'Prioridad de la tarea' })
  priority: string;

  @ApiProperty({
    example: {
      id: 2,
      name: 'Proyecto ABC'
    },
    description: 'Proyecto al que está asociada esta tarea',
  })
  associated_project: {
    id: number;
    name: string;
  };
}
