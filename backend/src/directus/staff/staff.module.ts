// /directus/staff/staff.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaffController } from './staff.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { CreateStaffUseCase } from './use-cases/create-staff.use-case';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';

@Module({
  imports: [HttpModule],
  controllers: [StaffController],
  providers: [
    LoginUseCase,
    CreateStaffUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
  ],
})
export class StaffModule {}
