import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../domain/enums/task.enums';

export class TaskResponseDto {
  @ApiProperty({
    description: 'ID de la tarea',
    example: '3a8f24a7-ea6a-4cf6-bef2-5fc8a2a48121',
  })
  id: string;

  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Comprobar funcionalidad de carrito de compra',
  })
  title: string;

  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Comprobar si almacena los productos tras pulsar "Añadir"',
  })
  description: string;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2025-03-22T00:00:00.000Z',
  })
  start_date: Date;

  @ApiProperty({
    description: 'Fecha de finalización (puede ser null)',
    example: '2025-03-29T00:00:00.000Z',
  })
  end_date: Date | null;

  @ApiProperty({
    description: 'Indicador de si la tarea se ha completado o no',
    example: false,
  })
  completed: boolean;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    example: 'high',
    enum: TaskPriority,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Estado actual de la tarea',
    example: 'pending',
    enum: TaskStatus,
  })
  status: TaskStatus;
}
