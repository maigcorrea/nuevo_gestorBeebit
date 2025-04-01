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
    const resetUrl = `http://localhost:3001/reset-password?email=${encodeURIComponent(to)}`;
    
    const info = await this.transporter.sendMail({
      from: '"Gestor de Proyectos 👨‍💻" <no-reply@gestor.com>',
      to,
      subject: 'Recuperación de contraseña',
      text: 'Haz clic en este enlace para restablecer tu contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>`,
    });

    console.log('Mensaje enviado: %s', info.messageId);

    return info;
  }
}