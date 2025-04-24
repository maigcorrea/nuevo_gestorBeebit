import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { SendMessageInput } from 'src/messages/domain/interfaces/send-message.input';
import { Inject } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from 'src/messages/domain/token/message-repository.token';
import { MessageRepositoryPort } from 'src/messages/domain/ports/message.repository.port';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @InjectQueue('mailQueue')
    private readonly mailQueue: Queue,
    @Inject(MESSAGE_REPOSITORY)
     private readonly repository: MessageRepositoryPort
  ) {}

  async execute(input: SendMessageInput): Promise<{ message: string }> {
    const { to, subject, text, senderId } = input;

    await this.mailQueue.add('sendMail', {
      to,
      subject,
      text,
      senderId,
    });

    return { message: 'Correo encolado correctamente' };
  }
}
