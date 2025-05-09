// /directus/staff/staff.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaffController } from './staff.controller';
import { LoginUseCase } from './use-cases/login.use-case';

@Module({
  imports: [HttpModule],
  controllers: [StaffController],
  providers: [LoginUseCase],
})
export class StaffModule {}
