import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MessageOrmEntity } from 'src/messages/infrastructure/persistence/message.orm-entity'; // ✅ entidad de persistencia
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
import { MESSAGE_REPOSITORY } from 'src/messages/domain/token/message-repository.token';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { MessageRepositoryPort } from 'src/messages/domain/ports/message.repository.port';
import { StaffRepositoryPort } from 'src/staff/domain/ports/staff.repository.port';
import { Message } from 'src/messages/domain/entities/messages.entity';


//Escucha los eventos de la cola. El código que se ejecuta cuando la cola lo dispare.

@Processor('mail-queue') // Este decorador lo convierte en un worker para esa cola
export class MailProcessor {
  constructor(private readonly mailService: MailService,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepositoryPort,
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepository: StaffRepositoryPort,
  ) {}

  @Process('send-password-reset')
  async handlePasswordReset(job: Job<{ email: string; token: string }>) {
    const { email, token } = job.data;
    await this.mailService.sendPasswordResetEmail(email, token);
  }

  @Process('send-mail') // El nombre del job
  async handleSendMailCustom(job: Job) {
    const { to, subject, text } = job.data;

    console.log('📨 Procesando correo desde la cola:', job.data);

    await this.mailService.sendMail({
      to,
      subject,
      text,
    });

    console.log('✅ Correo enviado a:', to);
  }

  @Process('sendMail')
async handleSendMail(job: Job<{ to: string; subject: string; text: string; senderId: string }>) {
  const { to, subject, text, senderId } = job.data;

  try {
    //Enviar el correo
    await this.mailService.sendMail({ to, subject, text });
  
    //Obtener entidades sender y receiver
    const sender = await this.staffRepository.findById(senderId);
    const receiver = await this.staffRepository.findByEmail(to);
  
    if (!sender || !receiver) {
      console.warn('No se pudo guardar el mensaje: usuario no encontrado');
      console.warn(`senderId: ${senderId}, to: ${to}`);
      return;
    }
  
    //guardar el mensaje en la bd
    const message = new Message(
      crypto.randomUUID(),
      sender.id,
      receiver.id,
      subject,
      text,
      new Date()
    );
  
    await this.messageRepository.save(message);
  
    console.log(`Correo enviado a ${to} y guardado en bd`);
    
  } catch (error) {
    console.error('Error en el proceso de envío y guardado de mensaje', error);
  }
}
}