import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from 'src/project/entities/project.entity';

export class ProjectByUserResponseDto{
    @ApiProperty({ example: 1, description: 'ID del proyecto' })
    id: string;
  
    @ApiProperty({ example: 'Título del proyecto' })
    title: string;
  
    @ApiProperty({ example: 'Descripción del proyecto' })
    description: string;
  
    @ApiProperty({ example: '2025-03-01', description: 'Fecha de inicio del proyecto' })
    start_date: Date | null;
    
    @ApiProperty({ example: '2025-06-21', description: 'Fecha de entrega límite del proyecto'})
    deadline:Date | null;
    
    @ApiProperty({example:'active', description: 'Estado del proyecto'})
    status:ProjectStatus;

    @ApiProperty({example:'2025-02-10', description: 'Última fecha de actualización del proyecto'})
    last_update:Date | null;


    @ApiPropertyOptional({
        description: 'URL pública al documento adjunto del proyecto',
        example: 'http://localhost:9000/archivos/projects/manual.pdf',
    })
    document_url?: string;

}