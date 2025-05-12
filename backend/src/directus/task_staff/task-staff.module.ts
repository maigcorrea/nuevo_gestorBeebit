import { Module } from '@nestjs/common';
import { TasksStaffController } from './task-staff.controller';
import { GetTasksByUserUseCase } from './use-cases/get-tasks-by-user.user-case';

@Module({
  controllers: [TasksStaffController],
  providers: [GetTasksByUserUseCase],
})
export class TasksStaffModule {}
