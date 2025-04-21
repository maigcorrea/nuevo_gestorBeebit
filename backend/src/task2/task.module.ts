
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TASK_REPOSITORY } from './domain/ports/task.repository.token';

import { TaskOrmEntity } from './infrastructure/persistence/task.orm-entity';
import { TaskRepository } from './infrastructure/persistence/task.repository';
import { TaskRepositoryPort } from './domain/ports/task.repository.port';

import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { FindAllTasksUseCase } from './application/use-cases/find-all-tasks.use-case';
import { FindTasksByProjectUseCase } from './application/use-cases/find-tasks-by-project.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
//import { ProjectRepository } from 'src/project/infrastructure/persistence/project.repository'; // o la ruta correcta
//import { ProjectRepositoryPort } from 'src/project/domain/ports/project.repository.port';

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
    {
        provide: FindTasksByProjectUseCase,
        useFactory: (repo: TaskRepositoryPort) => new FindTasksByProjectUseCase(repo),
        inject: [TASK_REPOSITORY],
    },
    {
        provide: UpdateTaskUseCase,
        useFactory: (repo: TaskRepositoryPort) => new UpdateTaskUseCase(repo),
        inject: [TASK_REPOSITORY],
      },
  ],
  exports: [CreateTaskUseCase, FindTasksByProjectUseCase, UpdateTaskUseCase], // Exportamos si se usará desde el controlador
})
export class TaskModule {}
