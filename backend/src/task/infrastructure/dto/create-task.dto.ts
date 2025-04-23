import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional, IsDateString, IsIn, IsUUID } from 'class-validator';
import { TaskPriority } from 'src/task/domain/enums/task.enums';

export class CreateTaskDto {
  @ApiProperty({
    description: "Título de la tarea",
    example: "Completar test con Jest"
  })
  @IsNotEmpty()
  @IsString({ message: "El título debe ser un texto" })
  @Length(1, 100, { message: "Debe tener entre 1 y 100 caracteres" })
  title: string;

  @ApiPropertyOptional({
    description: "Descripción de la tarea",
    example: "Hay que hacer test sobre la funcionalidad de compra"
  })
  @IsOptional()
  @IsString({ message: "La descripción debe ser un texto" })
  @Length(0, 200, { message: "Máximo 200 caracteres" })
  description: string;

  @ApiProperty({
    description: "ID del proyecto al que está asociada la tarea",
    example: "project-uuid"
  })
  @IsUUID()
  @IsNotEmpty()
  associated_project_id: string;

  @ApiPropertyOptional({
    description: "Fecha de inicio de la tarea (ISO)",
    example: "2025-05-01"
  })
  @IsOptional()
  @IsDateString({}, { message: "Debe estar en formato ISO (yyyy-mm-dd)" })
  start_date?: string;

  @ApiProperty({
    description: "Prioridad (high, medium o low)",
    example: "high"
  })
  @IsString()
  @IsIn(['high', 'medium', 'low'], {
    message: "Debe ser high, medium o low",
  })
  priority: TaskPriority;
}
