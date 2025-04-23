import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';
import { UpdateTaskStaffInput } from '../../domain/interfaces/update-task-staff.input';

export class UpdateTaskStaffDto implements UpdateTaskStaffInput {
  @ApiProperty({
    description: 'ID de la tarea actual',
    example: '6b203f84-37de-4cf6-8b8f-2d7be43c44d3',
  })
  @IsUUID()
  old_task_id: string;

  @ApiProperty({
    description: 'ID del empleado actual asignado',
    example: '28e7f284-21c0-4705-85c0-1b10f9c3b1a4',
  })
  @IsUUID()
  old_staff_id: string;

  @ApiPropertyOptional({
    description: 'Nuevo ID de la tarea (opcional)',
    example: 'e5a0bc93-41d0-4eb5-8ef5-2f1f01e7f93b',
  })
  @IsOptional()
  @IsUUID()
  new_task_id?: string;

  @ApiPropertyOptional({
    description: 'Nuevo ID del empleado (opcional)',
    example: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @IsOptional()
  @IsUUID()
  new_staff_id?: string;
}
