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
    
  ],
})
export class StaffModule {}
