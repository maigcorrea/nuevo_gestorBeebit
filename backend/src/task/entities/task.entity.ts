import { Project } from 'src/project/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
 
 @Entity()
 export class Task{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length: 100})
    title:string;

    @Column({length: 200})
    description:string;

    // 🔗 Relación ManyToOne con Project
    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' }) // Este será el nombre de la columna en la tabla
    associated_project:Project;

    @Column()
    start_date:Date;

    @Column()
    end_date:Date;

    //@Column()
    //start_time:Date;

    //@Column()
    //end_time:Date;

    @Column()
    completed:boolean;

    @Column()
    priority:string;

    @Column()
    status:string;
 
 }