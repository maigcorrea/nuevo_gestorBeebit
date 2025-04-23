import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/staff/domain/entities/staff.entity';
import { Project } from 'src/project/domain/entities/project.entity';
import { StaffSeeder } from './staff.seed';
import { ProjectSeeder } from './project.seed';
import { TaskSeeder } from './task.seeder';
import { Task } from 'src/task/domain/entities/task.entity';
import { TaskStaffSeeder } from './task-staff.seed';
import { TaskStaff } from 'src/tasks_staff/domain/entities/task-staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Project, Task, TaskStaff])],
  providers: [StaffSeeder, ProjectSeeder, TaskSeeder, TaskStaffSeeder],
})
export class SeedModule {}
