import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tareas')
export class TareaOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  titulo: string;

  @Column()
  creadaEn: Date;

  @Column()
  estado: string;
}