import { ApiProperty } from '@nestjs/swagger';

export class ProjectByUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string | null;

  @ApiProperty()
  start_date: string;

  @ApiProperty({ required: false })
  deadline: string | null;

  @ApiProperty()
  last_update: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  document_url?: string;
}
