import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStaffOrmEntity } from './infrastructure/persistence/task-staff.typeorm.entity';
import { TaskStaffRepository } from './infrastructure/persistence/task-staff.repository';
import { TaskStaffController } from 'src/tasks_staff/task-staff.controller';
import { CreateTaskStaffUseCase } from 'src/tasks_staff2/application/use-cases/create-task-staff.use-case';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { TaskRepository } from 'src/task2/infrastructure/persistence/task.repository';
import { StaffRepository } from 'src/staff2/infrastructure/persistence/staff.repository';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskStaffOrmEntity])],
  controllers: [TaskStaffController],
  providers: [
    {
      provide: 'TaskStaffRepositoryPort',
      useClass: TaskStaffRepository,
    },
    {
      provide: 'TaskRepositoryPort',
      useClass: TaskRepository,
    },
    {
      provide: 'StaffRepositoryPort',
      useClass: StaffRepository,
    },
    CreateTaskStaffUseCase,
    CaslAbilityFactory,
    MailQueueService,
  ],
})
export class TaskStaffModule {}
