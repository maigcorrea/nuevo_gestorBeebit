// /directus/directus.module.ts

import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { TasksStaffModule } from './task_staff/task-staff.module';

@Module({
  imports: [
    StaffModule,
    TasksStaffModule,
  ],
})
export class DirectusModule {}
