import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

// Servicio que permitirá añadir trabajos a la cola para enviar correos.
@Injectable()
export class MailQueueService {
  constructor(
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
  ) {}

  async enqueuePasswordReset(email: string, token: string) {
    await this.mailQueue.add('send-password-reset', {
      email,
      token,
    });
  }

  async sendMail(data: { to: string; subject: string; text: string }) {
    await this.mailQueue.add('sendMail', data); // el nombre del job es 'sendMail'
  }
}