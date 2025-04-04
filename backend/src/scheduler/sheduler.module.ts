import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskSchedulerService } from './task-schedule.service';
import { TaskStaffModule } from 'src/tasks_staff/task-staff.module';
import { TaskModule } from 'src/task/task.module';
import { MailQueueModule } from '../mail/mail-queue/mail-queue.module'; // si vas a usar la cola de mails
import { Project } from 'src/project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project]),TaskStaffModule, MailQueueModule, TaskModule], // si necesitas acceder a tareas y enviar correos
  providers: [TaskSchedulerService],
})
export class SchedulerModule {}