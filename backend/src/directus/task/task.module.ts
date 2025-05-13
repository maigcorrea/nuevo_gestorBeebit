import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { UpdateStatusAndPriorityUseCase } from './use-cases/update-status-and-priority.use-case';
import { UpdateTaskStatusUseCase } from './use-cases/update-task-status.use-case';

@Module({
  controllers: [TaskController],
  providers: [UpdateStatusAndPriorityUseCase, UpdateTaskStatusUseCase],
})
export class TaskModule {}
