import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/staff/entities/staff.entity';
import { Project } from 'src/project/entities/project.entity';
import { StaffSeeder } from './staff.seed';
import { ProjectSeeder } from './project.seed';
import { TaskSeeder } from './task.seeder';
import { Task } from 'src/task/entities/task.entity';
import { TaskStaffSeeder } from './task-staff.seed';
import { TaskStaff } from 'src/tasks_staff/entities/taskStaff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Project, Task, TaskStaff])],
  providers: [StaffSeeder, ProjectSeeder, TaskSeeder, TaskStaffSeeder],
})
export class SeedModule {}
