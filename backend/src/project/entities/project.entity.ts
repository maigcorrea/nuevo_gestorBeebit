import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
 
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
 
 
 
 }