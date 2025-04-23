import { Injectable } from '@nestjs/common';
import { MessageRepositoryPort } from 'src/messages2/domain/ports/message.repository.port';
import { Message } from 'src/messages2/domain/entities/messages.entity';
import { FindSentMessagesInput } from 'src/messages2/domain/interfaces/find-sent-messages.input';

@Injectable()
export class FindSentMessagesByUserUseCase {
  constructor(private readonly repository: MessageRepositoryPort) {}

  async execute(input: FindSentMessagesInput): Promise<Message[]> {
    return this.repository.findAllBySender(input.senderId);
  }
}
