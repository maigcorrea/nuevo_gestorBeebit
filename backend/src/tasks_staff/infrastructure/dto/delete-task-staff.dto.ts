import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { DeleteTaskStaffInput } from 'src/tasks_staff/domain/interfaces/delete-task-staff.input';

export class DeleteTaskStaffDto implements DeleteTaskStaffInput {
  @ApiProperty({ example: '3e3451c4-6f1e-4f1e-9c5f-987c4bde6c2a' })
  @IsUUID()
  id_task: string;

  @ApiProperty({ example: '1b4531d9-39c4-47f2-b1c5-623f7f98f617' })
  @IsUUID()
  id_staff: string;
}
