import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff/entities/staff.entity';

// Esta entidad representa la relación entre empleados (Staff) y tareas (Task), muchas a muchas (con tabla intermedia).
@Entity()
export class TaskStaff{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    //Con esto, cada fila en task_staff enlaza una tarea y un empleado. COn toda la información de cada uno incluida

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