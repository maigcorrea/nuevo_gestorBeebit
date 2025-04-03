import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../mail.service';

@Processor('mail-queue') // El nombre de la cola que declaraste en MailQueueModule
export class MailQueueProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-mail') // El nombre del job
  async handleSendMail(job: Job) {
    const { to, subject, text } = job.data;

    console.log('📨 Procesando correo desde la cola:', job.data);

    await this.mailService.sendMail({
      to,
      subject,
      text,
    });

    console.log('✅ Correo enviado a:', to);
  }
}