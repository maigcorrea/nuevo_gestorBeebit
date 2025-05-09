// /directus/staff/staff.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaffController } from './staff.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { CreateStaffUseCase } from './use-cases/create-staff.use-case';

@Module({
  imports: [HttpModule],
  controllers: [StaffController],
  providers: [
    LoginUseCase,
    CreateStaffUseCase,
  ],
})
export class StaffModule {}
