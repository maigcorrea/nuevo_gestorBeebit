// data-source.ts
import { DataSource } from 'typeorm'; // importa tus entidades
import { Project } from './src/project/entities/project.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { TaskStaff } from 'src/tasks_staff/entities/taskStaff.entity';
import { Task } from 'src/task/entities/task.entity';
import { Messages } from 'src/messages/entities/messages.entity';
// ...otras entidades

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'test',
  entities: [ Project, Staff, TaskStaff, Task, Messages],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // ⚠️ muy importante desactivarlo para usar migraciones
});

