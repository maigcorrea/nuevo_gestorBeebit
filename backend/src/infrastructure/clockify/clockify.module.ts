import { Module } from '@nestjs/common';
import { ClockifyService } from './clockyfy.service';
import { ConfigModule } from '@nestjs/config';
import { ClockifyController } from './clockify.controller';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';
import { StaffRepository } from 'src/staff/infrastructure/persistence/staff.repository';
import { TaskRepository } from 'src/task/infrastructure/persistence/task.repository';
import { ProjectRepository } from 'src/project/infrastructure/persistence/project.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
import { TaskTypeOrmEntity } from 'src/task/infrastructure/persistence/task.typeorm.entity';
import { ProjectTypeOrmEntity } from 'src/project/infrastructure/persistence/project.typeorm.entity';

@Module({
  imports: [ ConfigModule, TypeOrmModule.forFeature([StaffOrmEntity, TaskTypeOrmEntity, ProjectTypeOrmEntity])],
  controllers: [ClockifyController],
  providers: [ClockifyService, 
    {
    provide: STAFF_REPOSITORY,
    useClass: StaffRepository,
  },
  {
    provide: TASK_REPOSITORY,
    useClass: TaskRepository,
  },
  {
    provide: PROJECT_REPOSITORY,
    useClass: ProjectRepository,
  },
],
  exports: [ClockifyService],
})
export class ClockifyModule {}
