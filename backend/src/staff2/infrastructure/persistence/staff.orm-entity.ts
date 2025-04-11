import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { StaffType } from '../../domain/entities/staff.entity';
  import { Messages } from 'src/messages/entities/messages.entity'; // o ajusta la ruta según tu estructura
  
  @Entity('staff')
  export class StaffOrmEntity {
    @PrimaryColumn('uuid')
    id: string;
  
    @Column({ length: 100, unique: true })
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    register_date: Date;
  
    @Column({ unique: true })
    phone: string;
  
    @Column({ select: false })
    password: string;
  
    @Column({
      type: 'enum',
      enum: StaffType,
      default: StaffType.USER,
    })
    type: StaffType;
  
    @Column({ type: 'varchar', nullable: true })
    resetToken: string | null;
  
    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpiry: Date | null;
  
    @Column({ nullable: true })
    profileImage: string;
  
    @OneToMany(() => Messages, (message) => message.sender)
    sentMessages: Messages[];
  }
  