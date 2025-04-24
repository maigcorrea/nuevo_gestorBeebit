import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { MessageOrmEntity } from './infrastructure/persistence/message.orm-entity';
import { MESSAGE_REPOSITORY } from './domain/token/message-repository.token';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { MessageController } from './infrastructure/controllers/message.controller';


import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { FindSentMessagesByUserUseCase } from './application/use-cases/find-sent-messages-by-user.use-case';
import { FindReceivedMessagesByUserUseCase } from './application/use-cases/find-received-messages-by-user.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageOrmEntity]),
    BullModule.registerQueue({ name: 'mailQueue' }),
  ],
  controllers: [MessageController],
  providers: [
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepository,
    },
    MessageRepository,
    SendMessageUseCase,
    FindSentMessagesByUserUseCase,
    FindReceivedMessagesByUserUseCase,
  ],
})
export class MessagesModule {}
