import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskStaffController } from './infrastructure/controllers/task-staff.controller';
import { TaskStaffOrmEntity } from './infrastructure/persistence/task-staff.orm-entity';
import { TaskStaffRepository } from './infrastructure/persistence/task-staff.repository';
import { TaskStaffRepositoryPort } from './domain/ports/task-staff.repository.port';

import { TaskRepositoryPort } from 'src/task2/domain/ports/task.repository.port';
import { StaffRepositoryPort } from 'src/staff2/domain/ports/staff.repository.port';
import { TaskRepository } from 'src/task2/infrastructure/persistence/task.repository';
import { StaffRepository } from 'src/staff2/infrastructure/persistence/staff.repository';

import { CreateTaskStaffUseCase } from './application/use-cases/create-task-staff.use-case';
import { CaslModule } from 'src/casl/casl.module';
import { MailQueueModule } from 'src/mail/mail-queue/mail-queue.module';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { TaskTypeOrmEntity } from 'src/task2/infrastructure/persistence/task.typeorm.entity';
import { StaffOrmEntity } from 'src/staff2/infrastructure/persistence/staff.orm-entity';
import { STAFF_REPOSITORY } from 'src/staff2/domain/token/staff.token';
import { FindAllTaskStaffUseCase } from './application/use-cases/find-all-task-staff.use-case';
import { FindTaskStaffGroupedByTaskUseCase } from './application/use-cases/find-grouped-by-task.use-case';
import { GetTasksByUserUseCase } from './application/use-cases/get-tasks-by-user.use-case';
import { GetProjectsByUserUseCase } from './application/use-cases/get-projects-by-user.use-case';
import { UpdateTaskStaffUseCase } from './application/use-cases/update-task-staff.use-case';
import { DeleteTaskStaffUseCase } from './application/use-cases/delete-task-staff.use-case';
import { FindTasksDueTomorrowUseCase } from './application/use-cases/find-tasks-due-tomorrow.use-case';
import { ExportProjectsToExcelUseCase } from './application/use-cases/export-projects-to-excel.use-case';
import { ExportProjectsToPDFUseCase } from './application/use-cases/export-project-to-pdf.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskStaffOrmEntity,
      TaskTypeOrmEntity,
      StaffOrmEntity,
      FindTaskStaffGroupedByTaskUseCase,
      GetTasksByUserUseCase,
      GetProjectsByUserUseCase,
      UpdateTaskStaffUseCase,
      DeleteTaskStaffUseCase,
      FindTasksDueTomorrowUseCase,
      ExportProjectsToExcelUseCase,
      ExportProjectsToPDFUseCase,
    ]),
    CaslModule,
    MailQueueModule,
  ],
  controllers: [TaskStaffController],
  providers: [
    // Use case
    CreateTaskStaffUseCase,
    FindAllTaskStaffUseCase,

    // Repositorio principal de TaskStaff
    {
      provide: TaskStaffRepositoryPort,
      useClass: TaskStaffRepository,
    },
    // Inyectamos también los de Task y Staff
    {
      provide: TaskRepositoryPort,
      useClass: TaskRepository,
    },
    {
      provide: STAFF_REPOSITORY,
      useClass: StaffRepository,
    },
    MailQueueService,
  ],
})
export class TaskStaffModule {}
