import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { MessageOrmEntity } from './infrastructure/persistence/message.orm-entity';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { MessageController } from './infrastructure/controllers/message.controller';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageOrmEntity]),
    BullModule.registerQueue({ name: 'mailQueue' }),
  ],
  controllers: [MessageController],
  providers: [
    MessageRepository,
    SendMessageUseCase,
  ],
})
export class MessagesModule {}
