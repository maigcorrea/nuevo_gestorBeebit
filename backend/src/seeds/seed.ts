import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Staff } from 'src/staff/domain/entities/staff.entity';
import { Project } from 'src/project/domain/entities/project.entity';
import { Task } from 'src/task/domain/entities/task.entity';
import { StaffSeeder } from './staff.seed';
import { ProjectSeeder } from './project.seed';
import { TaskSeeder } from './task.seeder';
import { TaskStaffSeeder } from './task-staff.seed';
import { TaskStaff } from 'src/tasks_staff/domain/entities/task-staff.entity';

seeder({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'test',
      entities: [Staff, Project, Task],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Staff, Project, Task, TaskStaff]),
  ],
}).run([StaffSeeder, ProjectSeeder, TaskSeeder, TaskStaffSeeder]);
