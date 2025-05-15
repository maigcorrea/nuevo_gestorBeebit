import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { FindSentMessagesUseCase } from './use-cases/find-sent-messages.use-case';
import { FindReceivedMessagesUseCase } from './use-cases/find-received-messages.use-case';
import { SaveMessageUseCase } from './use-cases/save-message.use-case';

@Module({
  controllers: [MessagesController],
  providers: [FindSentMessagesUseCase, FindReceivedMessagesUseCase, SaveMessageUseCase],
})
export class MessagesModule {}
