//ESPECÍFICO PARA ACTUALIZAR SÓLO EL STATUS DE UNA TAREA
/*
    Recomendable para: 
    - Marcar una tarea como completed desde un botón rápido tipo “Completar”.
    - Que un usuario normal solo pueda cambiar el estado, pero no editar title, description

*/
import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/task/entities/task.entity';

export class UpdateTaskStatusDto {
    @ApiProperty({ enum: TaskStatus, description: 'Nuevo estado de la tarea' })
    @IsEnum(TaskStatus, { message: 'El estado debe ser pending, active o completed' })
    status: TaskStatus;
}