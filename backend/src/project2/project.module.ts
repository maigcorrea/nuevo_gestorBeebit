import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTypeOrmEntity } from './infrastructure/persistence/project.typeorm.entity';
import { ProjectRepository } from './infrastructure/persistence/project.repository';
import { ProjectController } from './infrastructure/controllers/project.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { MinioModule } from '../minio/minio.module';
import { CaslModule } from '../casl/casl.module';
import { ProjectRepositoryPort } from './domain/ports/project.repository.port';
import { FindAllProjectsUseCase } from './application/use-cases/find-all-projects.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectTypeOrmEntity]),
    MinioModule,
    CaslModule,
  ],
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    FindAllProjectsUseCase,
    {
      provide: ProjectRepositoryPort,
      useClass: ProjectRepository,
    },
  ],
})
export class ProjectModule {}
