import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DeleteTaskStaffDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  id_task: number;

  @ApiProperty({ example: 7 })
  @IsInt()
  @Min(1)
  id_staff: number;
}