import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// MÓDULOS
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { StaffModule } from './staff/staff.module';
import { TaskStaffModule } from './tasks_staff/task-staff.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { MailQueueModule } from './mail/mail-queue/mail-queue.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/sheduler.module';
import { MessagesModule } from './messages/messages.module';
import { CaslModule } from './casl/casl.module';
// ENTIDADES
import { Project } from './project/entities/project.entity';
import { Task } from './task/entities/task.entity';
import { Staff } from './staff/entities/staff.entity';
import { TaskStaff } from './tasks_staff/entities/taskStaff.entity';
import { Messages } from './messages/entities/messages.entity';


//Ejemplo arquitectura hexagonal
import { TaskController } from './EjemploArquitectura/infrastructure/controllers/task.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 Así estará disponible en toda la app
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: 'postgres', // Host de la base de datos (puede ser un contenedor de Docker o una IP)
      port: 5432, // Puerto
      username: 'postgres', // Usuario de la base de datos
      password: 'password', // Contraseña de la base de datos
      database: 'test', // Nombre de la base de datos
      entities: [ Project, Task, Staff, TaskStaff, Messages], // Entidades que se utilizarán
      synchronize: false, // Sincroniza automáticamente la base de datos (solo en desarrollo) ← Esto borra y recrea la base de datos en cada inicio. Debería ser false y generar una migración.
      //synchronize: false
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    ProjectModule,
    TaskModule,
    StaffModule,
    TaskStaffModule,
    AuthModule,
    MailModule,
    MailQueueModule,
    SchedulerModule,
    MessagesModule,
    CaslModule
  ],
  controllers: [AppController, TaskController],
})
export class AppModule {}
