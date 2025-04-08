import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectQueue('mail-queue') private mailQueue: Queue,
  ) {}

  async sendEmail(dto: SendMessageDto) {
    //Enviar a la cola
    await this.mailQueue.add('sendMail', {
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
    });

    return { message: 'Correo encolado correctamente' };
  }
}