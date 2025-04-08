import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './entities/messages.entity';
import { Queue } from 'bull';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectQueue('mail-queue') private mailQueue: Queue,
    @InjectRepository(Messages) private messageRepository: Repository<Messages>
  ) {}

  async sendEmail(dto: SendMessageDto, senderId: string) {
    //Enviar a la cola
    await this.mailQueue.add('sendMail', {
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
      senderId, // este debe venir del token del usuario autenticado
    });

    return { message: 'Correo encolado correctamente' };
  }


  async findSentMessagesByUser(userId: string) {
    try {
      return this.messageRepository.find({
        where: { sender: { id: userId } },
        relations: ['receiver'], // para acceder a los datos del receptor
        order: { sentAt: 'DESC' },
      });     
    } catch (err) {
      console.error('❌ Error al obtener mensajes:', err);
    throw err;
    }
  }
}