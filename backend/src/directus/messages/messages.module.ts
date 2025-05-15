import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { FindSentMessagesUseCase } from './use-cases/find-sent-messages.use-case';
import { FindReceivedMessagesUseCase } from './use-cases/find-received-messages.use-case';

@Module({
  controllers: [MessagesController],
  providers: [FindSentMessagesUseCase, FindReceivedMessagesUseCase,],
})
export class MessagesModule {}
