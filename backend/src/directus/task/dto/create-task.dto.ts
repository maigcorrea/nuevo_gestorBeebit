// src/directus/task/dto/create-task.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  start_date?: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  associated_project: string;
}
