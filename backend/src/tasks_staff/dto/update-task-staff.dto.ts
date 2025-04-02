//PARA QUE LAS RELACIONES ENTRE TAREAS Y EMPLEADOS SE MODIFIQUEN (Cambiar el empleado asignado a una tarea o reasignar la tarea a otro empleado)
//Usar PATCH con campos opcionales porque: Puedes cambiar solo el id_staff, olo el id_task o ambos
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, IsUUID } from 'class-validator';

export class UpdateTaskStaffDto {
  @ApiProperty({ example: 3 })
  @IsUUID()
  old_task_id: string;

  @ApiProperty({ example: 2 })
  @IsUUID()
  old_staff_id: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsUUID()
  new_task_id: string;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsUUID()
  new_staff_id: string;
}