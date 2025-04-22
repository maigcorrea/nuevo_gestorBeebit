import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTypeOrmEntity } from './infrastructure/persistence/task.typeorm.entity';
import { TaskRepository } from './infrastructure/persistence/task.repository';
import { TaskRepositoryPort } from './domain/ports/task.repository.port';
import { TaskController } from './infrastructure/controllers/task.controller';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { CaslModule } from '../casl/casl.module';
import { FindTasksByProjectUseCase } from './application/use-cases/find-tasks-by-project.use-case';
import { FindAllTasksUseCase } from './application/use-cases/find-all-tasks.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { ProjectRepositoryPort } from 'src/project2/domain/ports/project.repository.port';
import { ProjectRepository } from 'src/project2/infrastructure/persistence/project.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskTypeOrmEntity]),
    CaslModule,
  ],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    FindAllTasksUseCase,
    FindTasksByProjectUseCase,
    UpdateTaskUseCase,
    {
      provide: TaskRepositoryPort,
      useClass: TaskRepository,
    },
    {
      provide: ProjectRepositoryPort,
      useClass: ProjectRepository,
    }
  ],
})
export class TaskModule {}
