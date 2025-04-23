 import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';

  import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
  
  @Entity('messages')
  export class MessageOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => StaffOrmEntity, staff => staff.sentMessages, { eager: true })
    sender: StaffOrmEntity;
  
    @ManyToOne(() => StaffOrmEntity, { eager: true })
    receiver: StaffOrmEntity;
  
    @Column()
    subject: string;
  
    @Column('text')
    text: string;
  
    @CreateDateColumn()
    sentAt: Date;
  }
  