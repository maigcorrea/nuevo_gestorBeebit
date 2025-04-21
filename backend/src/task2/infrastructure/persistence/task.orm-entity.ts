import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { TaskPriority, TaskStatus } from '../../domain/entities/task.enums';

@Entity()
export class TaskOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 200 })
  description: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' }) // nombre real en la tabla
  associated_project: Project;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date | null;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ type: 'enum', enum: TaskPriority })
  priority: TaskPriority;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;
}
