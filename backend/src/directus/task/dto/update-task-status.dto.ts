// src/directus/task/dto/update-task-status.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
