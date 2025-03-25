import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity'; // Importamos la entidad Project

@Module({
  imports: [TypeOrmModule.forFeature([Project])], // Registrar el repositorio Project
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
