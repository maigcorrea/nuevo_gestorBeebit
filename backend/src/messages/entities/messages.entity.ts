import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Staff } from 'src/staff2/domain/entities/staff.entity';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Staff, staff => staff.sentMessages)
  sender: Staff; //Id del usuario que ha enviado el correo. Esta es una relación ManyToOne, ya que muchos mensajes pueden haber sido enviados por un mismo usuario.

  @ManyToOne(() => Staff)
  receiver: Staff; //Id del usuario al que se le ha enviado el correo electrónico

  @Column()
  subject: string; //Asunto del correo

  @Column('text')
  text: string; //Contenido del correo

  @CreateDateColumn()
  sentAt: Date; //Fecha y hora en la que se envió el mensaje

}