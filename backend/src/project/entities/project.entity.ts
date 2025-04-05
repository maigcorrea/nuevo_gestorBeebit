import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

//ENUM
export enum ProjectStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
}
 
 @Entity()
 export class Project{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({length: 100})
    title:string;

    @Column({length: 200})
    description:string;

    @Column({ type: 'date', nullable: true })
    start_date:Date| null;

    @Column({type: 'date', nullable: true })
    deadline:Date | null;

    @Column({type: 'date', nullable: true })
    last_update:Date| null;

    @Column({
      type:'enum',
      enum:ProjectStatus,
      default: ProjectStatus.ACTIVE,
      nullable:false
    })
    status:ProjectStatus;

    @Column({ nullable: true })
    document_url: string; 

    /*
      Asegura que TypeORM entienda la relación entre Task y Project, y puedas usar relations: ['task', 'task.associated_project'] sin errores.
    */
     // Relación inversa con Task. le dice a TypeORM que un proyecto tiene muchas tareas.
   @OneToMany(() => Task, (task) => task.associated_project)
   tasks: Task[]; 
 
 
 
 }