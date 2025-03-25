import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStaffService } from './task-staff.service';
import { TaskStaffController } from './task-staff.controller';
import { TaskStaff } from './entities/taskStaff.entity'; // Importamos la entidad Task
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskStaff, Task, Staff])], //TypeOrmModule.forFeature([...]) le dice a NestJS qué repositorios de TypeORM deben estar disponibles dentro de ese módulo. Si no incluyes una entidad aquí, Nest no podrá inyectar su repositorio en los servicios de ese módulo.
  providers: [TaskStaffService],
  controllers: [TaskStaffController],
})
export class TaskStaffModule {}