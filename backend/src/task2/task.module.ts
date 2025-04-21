
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TASK_REPOSITORY } from './domain/ports/task.repository.token';

import { TaskOrmEntity } from './infrastructure/persistence/task.orm-entity';
import { TaskRepository } from './infrastructure/persistence/task.repository';
import { TaskRepositoryPort } from './domain/ports/task.repository.port';

import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { FindAllTasksUseCase } from './application/use-cases/find-all-tasks.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  providers: [
    TaskRepository,
    {
      provide: TASK_REPOSITORY,
      useExisting: TaskRepository,
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (repo: TaskRepositoryPort) => new CreateTaskUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
        provide: FindAllTasksUseCase,
        useFactory: (repo: TaskRepositoryPort) => new FindAllTasksUseCase(repo),
        inject: [TASK_REPOSITORY],
      },
  ],
  exports: [CreateTaskUseCase], // Exportamos si se usará desde el controlador
})
export class TaskModule {}
