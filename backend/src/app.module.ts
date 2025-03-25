import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// MÓDULOS
import { UsersModule } from './users/users.module'; // Tu módulo de usuarios
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { StaffModule } from './staff/staff.module';
import { TaskStaffModule } from './tasks_staff/task-staff.module';
// ENTIDADES
import { User } from './users/entities/user.entity'; // La entidad de usuario
import { Project } from './project/entities/project.entity';
import { Task } from './task/entities/task.entity';
import { Staff } from './staff/entities/staff.entity';
import { TaskStaff } from './tasks_staff/entities/taskStaff.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: 'postgres', // Host de la base de datos (puede ser un contenedor de Docker o una IP)
      port: 5432, // Puerto
      username: 'postgres', // Usuario de la base de datos
      password: 'password', // Contraseña de la base de datos
      database: 'test', // Nombre de la base de datos
      entities: [User, Project, Task, Staff, TaskStaff], // Entidades que se utilizarán
      synchronize: true, // Sincroniza automáticamente la base de datos (solo en desarrollo) ← Esto borra y recrea la base de datos en cada inicio. Debería ser false y generar una migración.
      //synchronize: false
    }),
    UsersModule, // Aquí importamos el módulo de usuarios
    ProjectModule,
    TaskModule,
    StaffModule,
    TaskStaffModule
  ],
})
export class AppModule {}
