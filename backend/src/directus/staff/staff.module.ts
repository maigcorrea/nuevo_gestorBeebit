// /directus/staff/staff.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaffController } from './staff.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { CreateStaffUseCase } from './use-cases/create-staff.use-case';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';
import { UploadProfilePictureUseCase } from './use-cases/update-profile-picture.use-case';
import { VerifyPasswordUseCase } from './use-cases/verify-password.use-case';
import { ChangePasswordUseCase } from './use-cases/change-password.use-case';
import { GetEmailsUseCase } from './use-cases/get-emails.use-case';

@Module({
  imports: [HttpModule],
  controllers: [StaffController],
  providers: [
    LoginUseCase,
    CreateStaffUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    UploadProfilePictureUseCase,
    VerifyPasswordUseCase,
    ChangePasswordUseCase,
    GetEmailsUseCase,
  ],
})
export class StaffModule {}
