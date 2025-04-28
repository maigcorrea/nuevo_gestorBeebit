import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { MessageRepositoryPort } from 'src/messages/domain/ports/message.repository.port';
import { Message } from 'src/messages/domain/entities/messages.entity';
import { FindReceivedMessagesInput } from 'src/messages/domain/interfaces/find-received-messages.input';
import { MESSAGE_REPOSITORY } from 'src/messages/domain/token/message-repository.token';

@Injectable()
export class FindReceivedMessagesByUserUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepositoryPort) {}

  async execute(input: FindReceivedMessagesInput): Promise<any[]> {
    const messages= await this.repository.findAllByReceiver(input.receiverId);

    return messages.map((message) => ({
      id: message.id,
      subject: message.subject,
      text: message.text,
      sentAt: message.sentAt,
      senderEmail: message.senderEmail,
      senderName: message.senderName,
    }));
  }
}
