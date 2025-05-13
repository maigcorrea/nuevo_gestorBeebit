// src/directus/task/dto/update-task.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Título de la tarea',
    example: 'Actualizar tests de integración',
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto' })
  @Length(2, 100, { message: 'Debe tener entre 2 y 100 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la tarea',
    example: 'Actualizar los test para cubrir la lógica nueva',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 200, { message: 'Máximo 200 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Prioridad de la tarea',
    example: 'high',
    enum: ['high', 'medium', 'low'],
  })
  @IsOptional()
  @IsIn(['high', 'medium', 'low'], { message: 'Debe ser high, medium o low' })
  priority?: 'high' | 'medium' | 'low';

  @ApiPropertyOptional({
    description: 'Estado de la tarea',
    example: 'completed',
    enum: ['pending', 'active', 'completed'],
  })
  @IsOptional()
  @IsIn(['pending', 'active', 'completed'], { message: 'Debe ser pending, active o completed' })
  status?: 'pending' | 'active' | 'completed';
}
