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
import { UpdateTaskStatusUseCase } from './application/use-cases/update-task-status.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { UpdateStatusAndPriorityUseCase } from './application/use-cases/update-status-and-priority.use-case';
import { TASK_REPOSITORY } from './domain/token/task-repository.token';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';
import { ProjectRepository } from 'src/project/infrastructure/persistence/project.repository';
import { ProjectModule } from 'src/project/project.module';
import { ClockifyModule } from 'src/infrastructure/clockify/clockify.module';
import { ClockifyService } from 'src/infrastructure/clockify/clockyfy.service';
import { ConfigModule } from '@nestjs/config';// necesario si usas ConfigService directamente
import { StaffRepository } from 'src/staff/infrastructure/persistence/staff.repository';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskTypeOrmEntity, StaffOrmEntity]),
    CaslModule,
    ProjectModule,
    ClockifyModule,
    ConfigModule,
  ],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    FindAllTasksUseCase,
    FindTasksByProjectUseCase,
    UpdateTaskUseCase,
    UpdateTaskStatusUseCase,
    DeleteTaskUseCase,
    UpdateStatusAndPriorityUseCase,
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
    {
      provide: STAFF_REPOSITORY,
      useClass: StaffRepository,
    },
    
  ],
  exports: [TASK_REPOSITORY],
})
export class TaskModule {}
