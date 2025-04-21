import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  IsEnum,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../../domain/entities/task.enums';
import { UpdateTaskInput } from '../../domain/interfaces/update-task.input';

export class UpdateTaskDto implements UpdateTaskInput {
  @ApiPropertyOptional({
    description: 'Título de la tarea',
    example: 'Actualizar lógica de pago',
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la tarea',
    example: 'Actualizar el comportamiento del pago al usar PayPal',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Length(0, 200, { message: 'La descripción puede tener hasta 200 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Prioridad de la tarea',
    example: 'high',
    enum: TaskPriority,
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'La prioridad debe ser high, medium o low' })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Estado de la tarea',
    example: 'completed',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'El estado debe ser pending, active o completed' })
  status?: TaskStatus;
}
