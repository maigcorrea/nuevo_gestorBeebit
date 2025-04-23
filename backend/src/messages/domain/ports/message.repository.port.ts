import { Message } from "../entities/messages.entity";

export interface MessageRepositoryPort {
  save(message: Message): Promise<Message>;
  findAllBySender(senderId: string): Promise<Message[]>;
  findAllByReceiver(receiverId: string): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
}