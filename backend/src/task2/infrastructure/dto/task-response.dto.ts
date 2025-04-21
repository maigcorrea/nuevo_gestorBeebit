import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../domain/entities/task.enums';
import { Task } from '../../domain/entities/task.entity';

export class TaskResponseDto {
  @ApiProperty({
    description: 'ID de la tarea',
    example: 'e1b2c3d4-1234-5678-9876-abcd1234efgh',
  })
  id: string;

  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Comprobar funcionalidad de carrito de compra',
  })
  title: string;

  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Comprobar si almacena los productos tras pulsar el botón de Añadir',
  })
  description: string;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2025-03-22T00:00:00.000Z',
  })
  start_date: Date;

  @ApiProperty({
    description: 'Fecha de finalización',
    example: '2025-03-29T00:00:00.000Z',
  })
  end_date: Date | null;

  @ApiProperty({
    description: 'Indicador de si la tarea se ha completado o no',
    example: true,
  })
  completed: boolean;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    example: 'high',
    enum: TaskPriority,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Estado en el que se encuentra la tarea',
    example: 'pending',
    enum: TaskStatus,
  })
  status: TaskStatus;

  /**
   * Convierte una entidad Task en un DTO para respuesta
   */
  static fromEntity(task: Task): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = task.id;
    dto.title = task.title;
    dto.description = task.description;
    dto.start_date = task.start_date;
    dto.end_date = task.end_date;
    dto.completed = task.completed;
    dto.priority = task.priority;
    dto.status = task.status;
    return dto;
  }
}
