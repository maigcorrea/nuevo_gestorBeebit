import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';
 
 @Entity()
 export class Project{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length: 100})
    title:string;

    @Column({length: 200})
    description:string;

    @Column()
    start_date:Date;

    @Column()
    deadline:Date;

    @Column()
    last_update:Date;

    @Column()
    status:string;


    /*
      Asegura que TypeORM entienda la relación entre Task y Project, y puedas usar relations: ['task', 'task.associated_project'] sin errores.
    */
     // Relación inversa con Task. le dice a TypeORM que un proyecto tiene muchas tareas.
   @OneToMany(() => Task, (task) => task.associated_project)
   tasks: Task[]; 
 
 
 
 }