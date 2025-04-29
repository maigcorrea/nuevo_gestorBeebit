import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { Project } from './project/domain/entities/project.entity';
import { Task } from './task/domain/entities/task.entity';
import { Staff } from './staff/domain/entities/staff.entity';
import { TaskStaff } from './tasks_staff/domain/entities/task-staff.entity';
import { Message } from './messages/domain/entities/messages.entity';
import { TareaOrmEntity } from './EjemploArquitectura/infrastructure/persistence/tarea.orm-entity';
import { TareaRepository } from './EjemploArquitectura/infrastructure/persistence/tarea.repository';


//Ejemplo arquitectura hexagonal
import { TaskController } from './EjemploArquitectura/infrastructure/controllers/task.controller';
import { StaffOrmEntity } from './staff/infrastructure/persistence/staff.orm-entity';




import { MessageOrmEntity } from './messages/infrastructure/persistence/message.orm-entity';
import { ProjectTypeOrmEntity } from './project/infrastructure/persistence/project.typeorm.entity';
import { TaskTypeOrmEntity } from './task/infrastructure/persistence/task.typeorm.entity';
import { TaskStaffOrmEntity } from './tasks_staff/infrastructure/persistence/task-staff.orm-entity';


console.log('🧪 StaffOrmEntity:', StaffOrmEntity);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 Así estará disponible en toda la app
      envFilePath:'.env',
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: process.env.DB_HOST, // Host de la base de datos (puede ser un contenedor de Docker o una IP)
      port: parseInt(process.env.DB_PORT!, 10), // Puerto
      username: process.env.DB_USER, // Usuario de la base de datos
      password: process.env.DB_PASSWORD, // Contraseña de la base de datos
      database: process.env.DB_NAME, // Nombre de la base de datos
      entities: [ Project, Task, Staff, TaskStaff, Message,  StaffOrmEntity, MessageOrmEntity, ProjectTypeOrmEntity, TaskTypeOrmEntity, TaskStaffOrmEntity], // Entidades que se utilizarán
      synchronize: false, // Sincroniza automáticamente la base de datos (solo en desarrollo) ← Esto borra y recrea la base de datos en cada inicio. Debería ser false y generar una migración.
    }),
    TypeOrmModule.forFeature([TareaOrmEntity]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!, 10),
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
  providers: [TareaRepository],
})
export class AppModule {}
