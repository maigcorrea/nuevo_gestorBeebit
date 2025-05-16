// /directus/directus.module.ts

import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { TasksStaffModule } from './task_staff/task-staff.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { MessagesModule } from './messages/messages.module';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    StaffModule,
    TasksStaffModule,
    TaskModule,
    ProjectModule,
    MessagesModule,
  ],
  controllers: [
    UploadController,
  ]
})
export class DirectusModule {}
