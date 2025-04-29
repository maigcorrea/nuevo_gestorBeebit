import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
      transport: {
        host: config.get<string>('MAIL_HOST'),
        port: parseInt(config.get<string>('MAIL_PORT') || '1025', 10),
        secure: false,
      },
      defaults: {
        from: '"Gestor Beebit" <no-reply@beebit.com>',
      },
    }),
    inject: [ConfigService]
  }),
  ],
  providers: [MailService],
  exports: [MailService], // Exportarlo para usar en otros módulos
})
export class MailModule {}