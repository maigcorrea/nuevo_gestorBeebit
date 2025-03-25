import { ApiProperty } from '@nestjs/swagger';

// ESTE DTO REPRESENTA CADA RELACIÓN INDIVIDUAL ENTRE UNA TAREA Y UN EMPLEADO
// Cuándo usarlo:
//Cuando quieres mostrar una lista plana de asignaciones.

//Para mostrar "¿Quién está en qué tarea?" sin agrupar.

//Es útil para tablas tipo Excel o para debugging.

export class TaskStaffResponseDto {
  //Este campo se usará para devolver el título de la tarea.
  //Se espera que este dato venga de rel.task.title en la entidad.
  @ApiProperty({ example: 'Completar informe de avance' })
  taskTitle: string;

  //Este campo devolverá el nombre completo del empleado asignado
  @ApiProperty({ example: 'Laura Sánchez' })
  staffFullName: string;
}