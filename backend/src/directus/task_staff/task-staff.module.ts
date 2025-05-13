import { Module } from '@nestjs/common';
import { TasksStaffController } from './task-staff.controller';
import { GetTasksByUserUseCase } from './use-cases/get-tasks-by-user.user-case';
import { GetProjectsByUserUseCase } from './use-cases/get-projects-by-user.use-case';
import { ExportProjectsToExcelUseCase } from './use-cases/export-projects-to-excel.use-case';
import { ExportProjectsToPDFUseCase } from './use-cases/export-projects-to-pdf.use-case';

@Module({
  controllers: [TasksStaffController],
  providers: [
    GetTasksByUserUseCase,
    GetProjectsByUserUseCase,
    ExportProjectsToExcelUseCase,
    ExportProjectsToPDFUseCase,
  ],
})
export class TasksStaffModule {}
