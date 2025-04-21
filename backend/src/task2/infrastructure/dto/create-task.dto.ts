import {
    IsString,
    IsNotEmpty,
    Length,
    IsOptional,
    IsUUID,
    IsDateString,
    IsIn,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  import { TaskPriority } from '../../domain/entities/task.enums';
  import { CreateTaskInput } from '../../domain/interfaces/create-task.input';
  
  export class CreateTaskDto implements CreateTaskInput {
    @ApiProperty({
      description: 'Título de la tarea',
      example: 'Completar test con Jest',
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    title: string;
  
    @ApiPropertyOptional({
      description: 'Descripción de la tarea',
      example: 'Hay que testear la funcionalidad de compra',
    })
    @IsOptional()
    @IsString()
    @Length(0, 200)
    description?: string;
  
    @ApiProperty({
      description: 'ID del proyecto asociado',
      example: 'e1b2c3d4-5678-9876-abcd1234abcd',
    })
    @IsUUID()
    @IsNotEmpty()
    associated_project: string;
  
    @ApiPropertyOptional({
      description: 'Fecha de inicio',
      example: '2025-03-23',
    })
    @IsOptional()
    @IsDateString()
    start_date?: string;
  
    @ApiProperty({
      description: 'Prioridad de la tarea',
      example: 'high',
    })
    @IsIn(['high', 'medium', 'low'], {
      message: 'La prioridad debe ser high, medium o low',
    })
    priority: TaskPriority;
  }
  