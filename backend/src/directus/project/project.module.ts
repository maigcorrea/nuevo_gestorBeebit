// src/directus/project/project.module.ts

import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { FindAllProjectsUseCase } from './use-cases/find-all-projects.use-case';

@Module({
  controllers: [ProjectController],
  providers: [FindAllProjectsUseCase],
})
export class ProjectModule {}
