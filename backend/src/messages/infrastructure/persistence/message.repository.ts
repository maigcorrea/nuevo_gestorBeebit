import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageRepositoryPort } from 'src/messages/domain/ports/message.repository.port';
import { MessageOrmEntity } from './message.orm-entity';
import { Message } from 'src/messages/domain/entities/messages.entity';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessageRepository implements MessageRepositoryPort {
  constructor(
    @InjectRepository(MessageOrmEntity)
    private readonly ormRepo: Repository<MessageOrmEntity>,
  ) {}

  async save(message: Message): Promise<Message> {
    const ormEntity = MessageMapper.toOrmEntity(message);
    const saved = await this.ormRepo.save(ormEntity);
    return MessageMapper.toDomainEntity(saved);
  }

  async findAllBySender(senderId: string): Promise<Message[]> {
    const messages = await this.ormRepo.find({ 
      where: { sender: { id: senderId } },
      relations: ['receiver'],
    });
    return messages.map(MessageMapper.toDomainEntity);
  }

  async findAllByReceiver(receiverId: string): Promise<Message[]> {
    const messages = await this.ormRepo.find({ 
      where: { receiver: { id: receiverId } } });
    return messages.map(MessageMapper.toDomainEntity);
  }

  async findById(id: string): Promise<Message | null> {
    const message = await this.ormRepo.findOne({ where: { id } });
    return message ? MessageMapper.toDomainEntity(message) : null;
  }
}