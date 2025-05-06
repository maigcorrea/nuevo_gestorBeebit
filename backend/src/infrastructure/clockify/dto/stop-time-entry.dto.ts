import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StopTimeEntryDto {
  @ApiProperty({ example: 'id-del-time-entry', description: 'ID del time entry en Clockify' })
  @IsString()
  timeEntryId: string;
}