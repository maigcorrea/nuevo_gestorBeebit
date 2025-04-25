import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../../domain/entities/project.entity';
import { CreateProjectInput } from '../../domain/interfaces/create-project.input';

export class CreateProjectDto implements CreateProjectInput {
  @ApiProperty({ example: 'Sistema de gestión', maxLength: 100 })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty({ example: 'Proyecto para gestionar tareas', maxLength: 200 })
  @IsString()
  @Length(1, 200)
  description: string;

  @ApiProperty({ example: '2025-05-01', required: false })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiProperty({ example: '2025-06-30', required: false })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiProperty({ enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
