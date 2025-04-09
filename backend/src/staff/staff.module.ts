import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from './entities/staff.entity'; // Importamos la entidad Staff
import { MailService } from 'src/mail/mail.service';
import { MinioService } from 'src/minio/minio.service';
import { MailQueueModule } from 'src/mail/mail-queue/mail-queue.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Staff]), MailQueueModule, CaslModule], // Registrar el repositorio Staff
  providers: [StaffService, MailService, MinioService],
  controllers: [StaffController],
})
export class StaffModule {}