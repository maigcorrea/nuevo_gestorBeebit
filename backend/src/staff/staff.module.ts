import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffController } from './infrastructure/controllers/staff.controller';
import { StaffOrmEntity } from './infrastructure/persistence/staff.orm-entity';
import { StaffRepository } from './infrastructure/persistence/staff.repository';
import { CreateStaffUseCase } from './application/use-cases/create-staff.use-case';
import { MailService } from 'src/mail/mail.service';
import { MinioService } from 'src/minio/minio.service';
import { MailQueueModule } from 'src/mail/mail-queue/mail-queue.module';
import { CaslModule } from 'src/casl/casl.module';
import { FindStaffByIdUseCase } from './application/use-cases/find-staff-by-id.use-case';
import { FindAllStaffUseCase } from './application/use-cases/find-all-staff.use-case';
import { UpdateStaffUseCase } from './application/use-cases/update-staff.use-case';
import { DeleteStaffUseCase } from './application/use-cases/delete-staff.use-case';
import { CheckNameExistsUseCase } from './application/use-cases/check-name-exists.use-case';
import { CheckEmailExistsUseCase } from './application/use-cases/check-email-exists.use-case';
import { CheckPhoneExistsUseCase } from './application/use-cases/check-phone-exists.use-case';
import { VerifyPasswordUseCase } from './application/use-cases/verify-password.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { HandleForgotPasswordUseCase } from './application/use-cases/handle-forgot-password.use-case';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { SaveProfileImageUseCase } from './application/use-cases/save-profile-image.use-case';
import { StaffRepositoryPort } from './domain/ports/staff.repository.port';


@Module({
  imports: [
    TypeOrmModule.forFeature([StaffOrmEntity]),
    MailQueueModule,
    CaslModule,
  ],
  controllers: [StaffController],
  providers: [
    MailService,
    MinioService,
    StaffRepository,
    {
      provide: CreateStaffUseCase,
      useFactory: (staffRepo: StaffRepository) => new CreateStaffUseCase(staffRepo),
      inject: [StaffRepository],
    },
    {
      provide: FindStaffByIdUseCase,
      useFactory: (repo: StaffRepository) => new FindStaffByIdUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: FindAllStaffUseCase,
      useFactory: (repo: StaffRepository) => new FindAllStaffUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: UpdateStaffUseCase,
      useFactory: (repo: StaffRepository) => new UpdateStaffUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: DeleteStaffUseCase,
      useFactory: (repo: StaffRepository) => new DeleteStaffUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: CheckNameExistsUseCase,
      useFactory: (repo: StaffRepository) => new CheckNameExistsUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: CheckEmailExistsUseCase,
      useFactory: (repo: StaffRepository) => new CheckEmailExistsUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: CheckPhoneExistsUseCase,
      useFactory: (repo: StaffRepository) => new CheckPhoneExistsUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: VerifyPasswordUseCase,
      useFactory: (repo: StaffRepository) => new VerifyPasswordUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (repo: StaffRepository) => new ChangePasswordUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: HandleForgotPasswordUseCase,
      useFactory: (repo: StaffRepository, mailQueue: MailQueueService) =>
        new HandleForgotPasswordUseCase(repo, mailQueue),
      inject: [StaffRepository, MailQueueService],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (repo: StaffRepository) => new ResetPasswordUseCase(repo),
      inject: [StaffRepository],
    },
    {
      provide: SaveProfileImageUseCase,
      useFactory: (repo: StaffRepositoryPort) => new SaveProfileImageUseCase(repo),
      inject: [StaffRepository],
    },
    
    
  ],
})
export class StaffModule {}
