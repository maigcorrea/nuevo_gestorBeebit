import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'mailpit', // el nombre del servicio en docker-compose
    port: 1025, // puerto SMTP de Mailpit
    secure: false, // no SSL
  });

  async sendPasswordResetEmail(to: string) {
    const info = await this.transporter.sendMail({
      from: '"Gestor de Proyectos 👨‍💻" <no-reply@gestor.com>',
      to,
      subject: 'Recuperación de contraseña',
      text: 'Haz clic en este enlace para restablecer tu contraseña',
      html: '<b>Haz clic aquí para restablecer tu contraseña</b>',
    });

    console.log('Mensaje enviado: %s', info.messageId);
  }
}