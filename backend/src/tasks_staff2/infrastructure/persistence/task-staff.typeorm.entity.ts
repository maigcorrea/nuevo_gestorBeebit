import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { TaskTypeOrmEntity } from 'src/task2/infrastructure/persistence/task.typeorm.entity';
  import { StaffOrmEntity } from 'src/staff2/infrastructure/persistence/staff.orm-entity';
  
  @Entity('task_staff')
  export class TaskStaffOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => TaskTypeOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_task' })
    task: TaskTypeOrmEntity;
  
    @ManyToOne(() => StaffOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_staff' })
    staff: StaffOrmEntity;
  }
  