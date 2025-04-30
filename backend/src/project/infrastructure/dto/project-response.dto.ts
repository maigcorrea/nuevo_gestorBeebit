import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../../domain/entities/project.entity';

export class ProjectResponseDto {
  @ApiProperty({ description: 'ID del proyecto', example: 'c3d0b9b1-12f4-48b3-a5b2-a9fe60e6c7cb' })
  id: string;

  @ApiProperty({ description: 'Título del proyecto', example: 'Tienda online' })
  title: string;

  @ApiProperty({ description: 'Descripción del proyecto', example: 'Tienda dedicada al comercio online al por mayor' })
  description: string;

  @ApiProperty({ description: 'Fecha de inicio', example: '2025-03-22' })
  start_date: Date | null;

  @ApiProperty({ description: 'Fecha de entrega', example: '2025-06-29' })
  deadline: Date | null;

  @ApiProperty({ description: 'Última actualización del proyecto', example: '2025-03-23' })
  last_update: Date | null;

  @ApiProperty({ description: 'Estado del proyecto', enum: ProjectStatus, example: 'paused' })
  status: ProjectStatus;

  @ApiPropertyOptional({
    description: 'URL pública al documento adjunto del proyecto',
    example: 'http://localhost:9000/archivos/projects/manual.pdf',
  })
  document_url?: string;


  @ApiPropertyOptional({
    description: 'ID del proyecto en Clockify',
    example: '6630e7ea943c7c32b3e527c9',
  })
  clockifyProjectId?: string;
}
