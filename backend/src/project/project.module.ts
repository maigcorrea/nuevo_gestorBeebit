import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity'; // Importamos la entidad Project
import { MinioModule } from 'src/minio/minio.module';
import { Task } from 'src/task/entities/task.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task]), MinioModule, CaslModule], // Registrar el repositorio Project
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [TypeOrmModule],
})
export class ProjectModule {}
