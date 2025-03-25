import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity'; // Importamos la entidad Task

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // Registrar el repositorio Task
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}