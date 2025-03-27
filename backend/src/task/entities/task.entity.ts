import { Project } from 'src/project/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

//ENUM
export enum TaskPriority {
   HIGH = 'high',
   MEDIUM = 'medium',
   LOW = 'low',
 }
 
 export enum TaskStatus {
   PENDING = 'pending',
   ACTIVE = 'active',
   COMPLETED = 'completed',
 }
 
 @Entity()
 export class Task{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length: 100})
    title:string;

    @Column({length: 200})
    description:string;

    // 🔗 Relación ManyToOne con Project
    // Relación con Project para obtener los proyectos asociados con una tarea
    /*
      Asegura que TypeORM entienda la relación entre Task y Project, y puedas usar relations: ['task', 'task.associated_project'] sin errores.
    */
   //Conecta cada tarea con su proyecto correspondiente. 
    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' }) // Este será el nombre de la columna en la tabla
    associated_project:Project;



    @Column({ type: 'timestamp' })
    start_date:Date;

    @Column({ type: 'timestamp', nullable: true })
    end_date:Date | null;

    //@Column()
    //start_time:Date;

    //@Column()
    //end_time:Date;

    @Column({ type: 'boolean', default: false })
    completed:boolean;



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