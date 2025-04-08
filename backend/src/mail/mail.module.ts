import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mailpit',
        port: 1025,
        secure: false,
      },
      defaults: {
        from: '"Gestor Beebit" <no-reply@beebit.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // Exportarlo para usar en otros módulos
})
export class MailModule {}