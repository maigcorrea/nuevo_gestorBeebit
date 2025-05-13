// /directus/directus.module.ts

import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { TasksStaffModule } from './task_staff/task-staff.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    StaffModule,
    TasksStaffModule,
    TaskModule,
    ProjectModule,
  ],
})
export class DirectusModule {}
