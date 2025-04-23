import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../domain/enums/task.enums';
import { UpdateTaskStatusInput } from '../../domain/interfaces/update-task-status.input';

export class UpdateTaskStatusDto implements UpdateTaskStatusInput {
  @ApiProperty({
    enum: TaskStatus,
    description: 'Nuevo estado de la tarea',
    example: 'completed',
  })
  @IsEnum(TaskStatus, {
    message: 'El estado debe ser pending, active o completed',
  })
  status: TaskStatus;
}
