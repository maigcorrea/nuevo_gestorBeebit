import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { SendMessageInput } from 'src/messages/domain/interfaces/send-message.input';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @InjectQueue('mailQueue')
    private readonly mailQueue: Queue,
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
