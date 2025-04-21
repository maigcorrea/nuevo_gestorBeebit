import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTypeOrmEntity } from './infrastructure/persistence/task.typeorm.entity';
import { TaskRepository } from './infrastructure/persistence/task.repository';
import { TaskRepositoryPort } from './domain/ports/task.repository.port';
import { TaskController } from './infrastructure/controllers/task.controller';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskTypeOrmEntity]),
    CaslModule,
  ],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    {
      provide: TaskRepositoryPort,
      useClass: TaskRepository,
    },
  ],
})
export class TaskModule {}
