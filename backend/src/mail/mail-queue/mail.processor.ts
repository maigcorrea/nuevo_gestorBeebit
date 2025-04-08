import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from 'src/messages/entities/messages.entity';
import { Staff } from 'src/staff/entities/staff.entity';

//Escucha los eventos de la cola. El código que se ejecuta cuando la cola lo dispare.

@Processor('mail-queue') // Este decorador lo convierte en un worker para esa cola
export class MailProcessor {
  constructor(private readonly mailService: MailService,
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
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
    const sender = await this.staffRepository.findOneBy({ id: senderId });
    const receiver = await this.staffRepository.findOneBy({ email: to });
  
    if (!sender || !receiver) {
      console.warn('No se pudo guardar el mensaje: usuario no encontrado');
      console.warn(`senderId: ${senderId}, to: ${to}`);
      return;
    }
  
    //guardar el mensaje en la bd
    const message = this.messageRepository.create({
      sender,
      receiver,
      subject,
      text,
    });
  
    await this.messageRepository.save(message);
  
    console.log(`Correo enviado a ${to} y guardado en bd`);
    
  } catch (error) {
    console.error('Error en el proceso de envío y guardado de mensaje', error);
  }
}
}