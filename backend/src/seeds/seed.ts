import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Staff } from 'src/staff2/domain/entities/staff.entity';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { StaffSeeder } from './staff.seed';
import { ProjectSeeder } from './project.seed';
import { SeedModule } from './seed.module';
import { TaskSeeder } from './task.seeder';
import { TaskStaffSeeder } from './task-staff.seed';
import { TaskStaff } from 'src/tasks_staff/entities/taskStaff.entity';

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
