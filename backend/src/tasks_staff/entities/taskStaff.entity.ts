import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff/entities/staff.entity';

@Entity()
export class TaskStaff{
    @PrimaryGeneratedColumn()
    id:number;

    //@ManyToOne: indica una relación "muchos a uno", @JoinColumn: personaliza el nombre de la clave foránea en la base de datos
    // Relación con la tabla Task
    @ManyToOne(() => Task, { onDelete: 'CASCADE' }) //Muchas filas en task_staff pueden apuntar a la misma tarea. Si se elimina una tarea, también se eliminan las filas relacionadas en task_staff.
    @JoinColumn({ name: 'id_task' }) // así se llama la columna en la tabla
    task: Task;


    // Relación con la tabla Staff
    @ManyToOne(() => Staff, { onDelete: 'CASCADE' })//Muchas filas en task_staff pueden apuntar al mismo empleado. Se elimina en cascada si el empleado se borra.
    @JoinColumn({ name: 'id_staff' })
    staff: Staff;

}