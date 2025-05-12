// src/backend/directus/tasks_staff/dto/task-by-user-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

class AssociatedProjectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class TaskByUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string | null;

  @ApiProperty({ required: false })
  start_date: string | null;

  @ApiProperty({ required: false })
  end_date: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  priority: string;

  @ApiProperty({ required: false, type: () => AssociatedProjectDto })
  associated_project: AssociatedProjectDto | null;
}
