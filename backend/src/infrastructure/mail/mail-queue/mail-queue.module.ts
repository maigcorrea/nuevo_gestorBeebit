import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailQueueService } from './mail-queue.service';
import { MailProcessor } from './mail.processor';
import { MailService } from '../mail.service';
import { MailModule } from '../mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/domain/entities/messages.entity';
import { Staff } from 'src/staff/domain/entities/staff.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { forwardRef } from '@nestjs/common';
import { StaffModule } from 'src/staff/staff.module';
import { MessageRepository } from 'src/messages/infrastructure/persistence/message.repository';
import { StaffRepository } from 'src/staff/infrastructure/persistence/staff.repository';
import { MESSAGE_REPOSITORY } from 'src/messages/domain/token/message-repository.token';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { MessageOrmEntity } from 'src/messages/infrastructure/persistence/message.orm-entity';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    TypeOrmModule.forFeature([MessageOrmEntity, StaffOrmEntity]),
    MailModule,
    MessagesModule,
    forwardRef(() => StaffModule), // Esto rompe la dependencia circular
  ],
  providers: [MailQueueService, MailProcessor, MailService,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepository, // o real repo adaptado
    },
    {
      provide: STAFF_REPOSITORY,
      useClass: StaffRepository,
    },
  ],
  exports: [MailQueueService, BullModule], // Para poder usarlo desde StaffService u otros
})
export class MailQueueModule {}