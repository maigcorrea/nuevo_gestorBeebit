// src/directus/project/dto/update-project.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsIn, IsDateString } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: 'Título del proyecto',
    example: 'Nueva plataforma web',
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto' })
  @Length(2, 100, { message: 'Debe tener entre 2 y 100 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción del proyecto',
    example: 'Proyecto para desarrollar una nueva plataforma web para clientes',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 500, { message: 'Máximo 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del proyecto',
    example: '2024-05-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe tener un formato ISO válido' })
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Fecha de entrega (deadline) del proyecto',
    example: '2024-06-30',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de entrega debe tener un formato ISO válido' })
  deadline?: string;

  @ApiPropertyOptional({
    description: 'Estado del proyecto',
    example: 'active',
    enum: ['pending', 'active', 'paused', 'completed'],
  })
  @IsOptional()
  @IsIn(['pending', 'active', 'paused', 'completed'], {
    message: 'El estado debe ser pending, active, paused o completed',
  })
  status?: 'pending' | 'active' | 'paused' | 'completed';
}
