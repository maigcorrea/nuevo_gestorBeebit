import { Injectable } from '@nestjs/common';
//import * as nodemailer from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  //Al usar  @nestjs-modules/mailer, no se necesita usar nodemailer directamente. Ese módulo es un wrapper oficial de NestJS sobre Nodemailer, y te permite enviar correos de forma más limpia, usando inyección de dependencias y una configuración centralizada.
  /*private transporter = nodemailer.createTransport({
    host: 'mailpit', // el nombre del servicio en docker-compose
    port: 1025, // puerto SMTP de Mailpit
    secure: false, // no SSL
  });*/

  async sendPasswordResetEmail(to: string, link: string) {
    
    const info = await this.mailerService.sendMail({
      to,
      subject: 'Recuperación de contraseña',
      text: 'Haz clic en este enlace para restablecer tu contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${link}">Reestablecer contraseña</a>`,
    });

    console.log('Mensaje enviado: %s', info.messageId);

    return info;
  }

  async sendMail({ to, subject, text }: { to: string; subject: string; text: string }) {
    await this.mailerService.sendMail({to, subject, text,});
  }
}