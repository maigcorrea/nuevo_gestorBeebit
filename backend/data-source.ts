// data-source.ts
import { DataSource } from 'typeorm'; // importa tus entidades
import { Project } from 'src/project/domain/entities/project.entity';
import { Staff } from 'src/staff/domain/entities/staff.entity';
import { TaskStaff } from 'src/tasks_staff/domain/entities/task-staff.entity';
import { Task } from 'src/task/domain/entities/task.entity';
import { Message } from 'src/messages/domain/entities/messages.entity';
// ...otras entidades

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'test',
  entities: [ Project, Staff, TaskStaff, Task, Message],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // ⚠️ muy importante desactivarlo para usar migraciones
});

