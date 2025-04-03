import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../mail.service';

//Escucha los eventos de la cola. El código que se ejecuta cuando la cola lo dispare.

@Processor('mail-queue') // Este decorador lo convierte en un worker para esa cola
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-password-reset')
  async handlePasswordReset(job: Job<{ email: string; token: string }>) {
    const { email, token } = job.data;
    await this.mailService.sendPasswordResetEmail(email, token);
  }
}