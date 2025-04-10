import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity'; // Importamos la entidad Task
import { ProjectModule } from '../project/project.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ProjectModule, CaslModule], // Registrar el repositorio Task
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}