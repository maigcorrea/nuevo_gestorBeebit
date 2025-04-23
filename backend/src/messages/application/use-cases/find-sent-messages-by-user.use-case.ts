import { Injectable } from '@nestjs/common';
import { MessageRepositoryPort } from 'src/messages/domain/ports/message.repository.port';
import { Message } from 'src/messages/domain/entities/messages.entity';
import { FindSentMessagesInput } from 'src/messages/domain/interfaces/find-sent-messages.input';

@Injectable()
export class FindSentMessagesByUserUseCase {
  constructor(private readonly repository: MessageRepositoryPort) {}

  async execute(input: FindSentMessagesInput): Promise<Message[]> {
    return this.repository.findAllBySender(input.senderId);
  }
}
