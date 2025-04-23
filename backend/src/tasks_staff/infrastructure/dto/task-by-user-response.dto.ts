import { ApiProperty } from '@nestjs/swagger';

export class TaskByUserResponseDto {
  @ApiProperty({ example: '6b203f84-37de-4cf6-8b8f-2d7be43c44d3', description: 'ID de la tarea' })
  id: string;

  @ApiProperty({ example: 'Redactar informe mensual', description: 'Título de la tarea' })
  title: string;

  @ApiProperty({ example: 'Revisión y entrega del informe al cliente final', description: 'Descripción detallada de la tarea' })
  description: string;

  @ApiProperty({ example: '2025-03-01', description: 'Fecha de inicio de la tarea' })
  start_date: Date;

  @ApiProperty({ example: '2025-03-27', description: 'Fecha de finalización (si existe)' })
  end_date: Date | null;

  @ApiProperty({ example: 'completed', description: 'Estado de la tarea (pending, active, completed)' })
  status: string;

  @ApiProperty({ example: true, description: 'Indica si la tarea ha sido completada' })
  completed: boolean;

  @ApiProperty({ example: 'alta', description: 'Prioridad de la tarea (baja, media, alta)' })
  priority: string;

  @ApiProperty({
    description: 'Información del proyecto asociado a la tarea',
    example: {
      id: 'a4b85c94-2bcd-4d4b-aafe-c2d0d9cb3e4e',
      name: 'Proyecto ABC',
    },
  })
  associated_project: {
    id: string;
    name: string;
  };
}
