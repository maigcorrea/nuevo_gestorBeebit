import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { FindSentMessagesUseCase } from './use-cases/find-sent-messages.use-case';

@Module({
  controllers: [MessagesController],
  providers: [FindSentMessagesUseCase],
})
export class MessagesModule {}
