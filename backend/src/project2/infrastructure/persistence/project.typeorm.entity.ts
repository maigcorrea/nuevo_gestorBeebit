import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatus } from 'src/project2/domain/entities/project.entity';
// Añadir relación con tareas cuando se migre Task
import { TaskTypeOrmEntity } from 'src/task2/infrastructure/persistence/task.typeorm.entity';

@Entity('project')
export class ProjectTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 200 })
  description: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date | null;

  @Column({ type: 'date', nullable: true })
  deadline: Date | null;

  @Column({ type: 'date', nullable: true })
  last_update: Date | null;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
    nullable: false,
  })
  status: ProjectStatus;

  @Column({ nullable: true })
  document_url: string | null;

  @OneToMany(() => TaskTypeOrmEntity, (task) => task.associated_project)
  tasks: TaskTypeOrmEntity[];
}
