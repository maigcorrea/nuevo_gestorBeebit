import { Controller, Get, Post } from '@nestjs/common';
//import { AppService } from './app.service';
import { MailQueueService } from './mail/mail-queue/mail-queue.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(//private readonly appService: AppService,
    private readonly mailQueueService: MailQueueService
  ) {}

  /*@Get()
  getHello(): string {
    return this.appService.getHello();
  }*/


  @Post('test-mail')
  @ApiOperation({ summary: 'Enviar correo de prueba a la cola' })
  async testMailQueue() {
    await this.mailQueueService.sendMail({
      to: 'test@correo.com',
      subject: 'Prueba Queue',
      text: '¡Hola! Esto es una prueba desde Bull.',
    });
    return { message: 'Correo añadido a la cola.' };
  }
}
