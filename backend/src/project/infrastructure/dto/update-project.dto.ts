import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ProjectStatus } from '../../domain/entities/project.entity';
import { UpdateProjectInput } from '../../domain/interfaces/update-project.input';

export class UpdateProjectDto implements UpdateProjectInput {
  @ApiPropertyOptional({
    description: 'Título del proyecto',
    example: 'Sistema de reservas online',
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto' })
  @Length(2, 100, { message: 'Debe tener entre 2 y 100 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción del proyecto',
    example: 'Aplicación para gestionar reservas de hoteles',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 200, { message: 'No puede exceder los 200 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del proyecto',
    example: '2025-04-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Debe tener formato ISO (YYYY-MM-DD)' })
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Fecha límite de entrega del proyecto',
    example: '2025-05-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Debe tener formato ISO (YYYY-MM-DD)' })
  deadline?: string;

  @ApiPropertyOptional({
    description: 'Estado del proyecto',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'active', 'paused', 'completed'], {
    message: 'Debe ser uno de: pending, active, paused, completed',
  })
  status?: ProjectStatus;
}
