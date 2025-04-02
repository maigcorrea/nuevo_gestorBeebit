import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsUUID } from 'class-validator';

export class DeleteTaskStaffDto {
  @ApiProperty({ example: 3 })
  @IsUUID()
  id_task: string;

  @ApiProperty({ example: 7 })
  @IsUUID()
  id_staff: string;
}