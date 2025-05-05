import { ApiProperty } from '@nestjs/swagger';

export class UpdateClockifyIdDto {
  @ApiProperty({
    description: 'ID del usuario en Clockify',
    example: '6630e7ea943c7c32b3e527c9',
  })
  clockifyUserId: string;
}