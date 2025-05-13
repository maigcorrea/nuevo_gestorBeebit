import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { UpdateStatusAndPriorityUseCase } from './use-cases/update-status-and-priority.use-case';

@Module({
  controllers: [TaskController],
  providers: [UpdateStatusAndPriorityUseCase],
})
export class TaskModule {}
