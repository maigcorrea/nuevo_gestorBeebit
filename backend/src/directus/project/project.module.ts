// src/directus/project/project.module.ts

import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { FindAllProjectsUseCase } from './use-cases/find-all-projects.use-case';
import { UpdateProjectUseCase } from './use-cases/update-project.use-case';
import { DeleteProjectUseCase } from './use-cases/delete-project.use-case';

@Module({
  controllers: [ProjectController],
  providers: [FindAllProjectsUseCase, UpdateProjectUseCase, DeleteProjectUseCase],
})
export class ProjectModule {}
