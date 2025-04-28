import { Message } from 'src/messages/domain/entities/messages.entity';
import { MessageOrmEntity } from '../persistence/message.orm-entity';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';

export class MessageMapper {
  static toDomainEntity(ormEntity: MessageOrmEntity): Message {
    return new Message(
      ormEntity.id,
      ormEntity.sender.id,
      ormEntity.receiver.id,
      ormEntity.subject,
      ormEntity.text,
      ormEntity.sentAt,
      ormEntity.receiver?.email,
      ormEntity.receiver?.name,
    );
  }

  static toOrmEntity(domainEntity: Message): MessageOrmEntity {
    const orm = new MessageOrmEntity();
    orm.id = domainEntity.id;
    orm.subject = domainEntity.subject;
    orm.text = domainEntity.text;
    orm.sentAt = domainEntity.sentAt;

    // Creamos los objetos de StaffOrmEntity con solo el ID, suficiente para relaciones
    orm.sender = { id: domainEntity.senderId } as StaffOrmEntity;
    orm.receiver = { id: domainEntity.receiverId } as StaffOrmEntity;

    return orm;
  }
}
