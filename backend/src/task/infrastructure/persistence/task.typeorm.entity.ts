import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { ProjectTypeOrmEntity } from 'src/project/infrastructure/persistence/project.typeorm.entity';
  import { TaskPriority, TaskStatus } from 'src/task/domain/enums/task.enums';
  
  @Entity('task')
  export class TaskTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    title: string;
  
    @Column({ length: 200 })
    description: string;
  
    @ManyToOne(() => ProjectTypeOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    associated_project: ProjectTypeOrmEntity;
  
    @Column({ type: 'timestamp' })
    start_date: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    end_date: Date | null;
  
    @Column({ type: 'boolean', default: false })
    completed: boolean;
  
    @Column({
      type: 'enum',
      enum: TaskPriority,
    })
    priority: TaskPriority;
  
    @Column({
      type: 'enum',
      enum: TaskStatus,
    })
    status: TaskStatus;
  }
  

  export { TaskTypeOrmEntity as Task };