import { Injectable } from '@nestjs/common';
import { MessageRepositoryPort } from 'src/messages/domain/ports/message.repository.port';
import { Message } from 'src/messages/domain/entities/messages.entity';
import { FindSentMessagesInput } from 'src/messages/domain/interfaces/find-sent-messages.input';
import { Inject } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from 'src/messages/domain/token/message-repository.token';

@Injectable()
export class FindSentMessagesByUserUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepositoryPort) {}

  async execute(input: FindSentMessagesInput): Promise<Message[]> {
    return this.repository.findAllBySender(input.senderId);
  }
}
