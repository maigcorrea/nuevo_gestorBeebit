// data-source.ts
import { DataSource } from 'typeorm'; // importa tus entidades
import { ProjectTypeOrmEntity } from 'src/project/infrastructure/persistence/project.typeorm.entity';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
import { TaskTypeOrmEntity } from 'src/task/infrastructure/persistence/task.typeorm.entity';
import { TaskStaffOrmEntity } from 'src/tasks_staff/infrastructure/persistence/task-staff.orm-entity';
import { MessageOrmEntity } from 'src/messages/infrastructure/persistence/message.orm-entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'test',
  entities: [ ProjectTypeOrmEntity, StaffOrmEntity, TaskStaffOrmEntity, TaskTypeOrmEntity, MessageOrmEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // ⚠️ muy importante desactivarlo para usar migraciones
});

