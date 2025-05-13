import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export class UpdateStatusPriorityDto {
  @ApiProperty({
    description: 'Nuevo estado de la tarea',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @ApiProperty({
    description: 'Nueva prioridad de la tarea',
    enum: TaskPriority,
  })
  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority: TaskPriority;
}
