import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { BullModule } from '@nestjs/bull';
import { MailService } from 'src/mail/mail.service';
import { Messages } from './entities/messages.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    TypeOrmModule.forFeature([Messages])
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MailService],
})
export class MessagesModule {}
