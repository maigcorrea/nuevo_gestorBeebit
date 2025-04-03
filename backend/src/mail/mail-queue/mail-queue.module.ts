import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailQueueService } from './mail-queue.service';
import { MailProcessor } from './mail.processor';
import { MailService } from '../mail.service';
import { MailQueueProcessor } from './mail-queue.processor';
import { MailModule } from '../mail.module';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    MailModule,
  ],
  providers: [MailQueueService, MailProcessor, MailService, MailQueueProcessor],
  exports: [MailQueueService], // Para poder usarlo desde StaffService u otros
})
export class MailQueueModule {}