import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailQueueService } from './mail-queue.service';
import { MailProcessor } from './mail.processor';
import { MailService } from '../mail.service';
import { MailModule } from '../mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from 'src/messages/entities/messages.entity';
import { Staff } from 'src/staff2/domain/entities/staff.entity';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    TypeOrmModule.forFeature([Messages, Staff]),
    MailModule,
  ],
  providers: [MailQueueService, MailProcessor, MailService],
  exports: [MailQueueService], // Para poder usarlo desde StaffService u otros
})
export class MailQueueModule {}