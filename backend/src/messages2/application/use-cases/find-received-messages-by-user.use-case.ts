import { Injectable } from '@nestjs/common';
import { MessageRepositoryPort } from 'src/messages2/domain/ports/message.repository.port';
import { Message } from 'src/messages2/domain/entities/messages.entity';
import { FindReceivedMessagesInput } from 'src/messages2/domain/interfaces/find-received-messages.input';

@Injectable()
export class FindReceivedMessagesByUserUseCase {
  constructor(private readonly repository: MessageRepositoryPort) {}

  async execute(input: FindReceivedMessagesInput): Promise<Message[]> {
    return this.repository.findAllByReceiver(input.receiverId);
  }
}
