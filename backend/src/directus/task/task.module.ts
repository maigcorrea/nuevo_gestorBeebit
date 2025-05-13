import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { UpdateStatusAndPriorityUseCase } from './use-cases/update-status-and-priority.use-case';
import { UpdateTaskStatusUseCase } from './use-cases/update-task-status.use-case';
import { FindAllTasksUseCase } from './use-cases/find-all-tasks.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';

@Module({
  controllers: [TaskController],
  providers: [UpdateStatusAndPriorityUseCase, UpdateTaskStatusUseCase, FindAllTasksUseCase, UpdateTaskUseCase, DeleteTaskUseCase],
})
export class TaskModule {}
