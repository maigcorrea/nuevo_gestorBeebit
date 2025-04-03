import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private transporter = nodemailer.createTransport({
    host: 'mailpit', // el nombre del servicio en docker-compose
    port: 1025, // puerto SMTP de Mailpit
    secure: false, // no SSL
  });

  async sendPasswordResetEmail(to: string, link: string) {
    
    const info = await this.transporter.sendMail({
      from: '"Gestor de Proyectos 👨‍💻" <no-reply@gestor.com>',
      to,
      subject: 'Recuperación de contraseña',
      text: 'Haz clic en este enlace para restablecer tu contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${link}">${link}</a>`,
    });

    console.log('Mensaje enviado: %s', info.messageId);

    return info;
  }

  async sendMail({ to, subject, text }: { to: string; subject: string; text: string }) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }
}