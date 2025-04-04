import { ApiProperty } from '@nestjs/swagger';

// ESTE DTO REPRESENTA CADA TAREA AGRUPADA CON UNA LISTA DE TODOS LOS EMPLEADOS ASIGNADOS A ELLA
//Cuándo usarlo:
//Cuando quieres mostrar una tarea con su equipo completo
//Ideal para mostrar la tarea como grupo principal y los empleados anidados.
//Se usa en el servicio, al agrupar empleados por tarea

export class TaskWithStaffResponseDto {
    @ApiProperty({ example: 3 })
    taskId: string;

    //Este dato será extraído de task.title cuando mapees los resultados desde la base de datos.
    @ApiProperty({ example: 'Comprobar login de usuarios' })
    taskTitle: string;


    //Un array de strings con los nombres completos de los empleados.
    @ApiProperty({
    description: 'Lista de empleados asignados con su id y nombre',
    example: [
        { id: 7, name: 'Laura Sánchez' },
        { id: 8, name: 'Carlos Pérez' }
    ],
    })
    staff: { id: string; name: string }[];
}