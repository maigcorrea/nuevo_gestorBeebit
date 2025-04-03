import { Controller, Get, Post, Delete, Put, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TaskStaffService } from './task-staff.service';
import { CreateTaskStaffDto } from './dto/create-task-staff.dto';
import { TaskStaffResponseDto } from './dto/task-staff-response.dto';
import { UpdateTaskStaffDto } from './dto/update-task-staff.dto';
import { DeleteTaskStaffDto } from './dto/delete-task-staff.dto';
import { TaskStaff } from './entities/taskStaff.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { TaskWithStaffResponseDto } from './dto/task-with-staff.response.dto';
import { TaskByUserResponseDto } from './dto/task-by-user-response.dto';
import { ProjectByUserResponseDto } from './dto/project-by-user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Task_Staff')
@Controller("tasks_staff")

export class TaskStaffController{
    constructor(private readonly taskStaffService: TaskStaffService) {}

    @Post()
    @ApiOperation({summary:"Crear relación entre un empleado y una tarea"})
    @ApiResponse({ status: 200, description: 'Relación creada correctamente'})
    @ApiResponse({ status: 404, description: 'Error. No se ha podido crear la relación' })
    create(@Body() dto: CreateTaskStaffDto) {
        return this.taskStaffService.create(dto);
    }

    @ApiOperation({summary:"Obtener todas las relaciones tarea-empleado"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Get()
    findAll(): Promise<TaskStaffResponseDto[]> {
        return this.taskStaffService.findAll();
    }

    @ApiOperation({summary:"Obtener todas las relaciones por tarea (tarea-[empleados])"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Get('por-tarea')
    findGroupedByTask(): Promise<TaskWithStaffResponseDto[]> {
        return this.taskStaffService.findGroupedByTask();
    }


    
    @ApiOperation({summary: "Obtener las tareas asignadas a un empleado concreto"})
    @ApiResponse({status:404, description:"Error"})
    @Get("por-usuario/:id")
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del usuario' })
    getTasksByUser( @Param('id', new ParseUUIDPipe()) id:string):Promise<TaskByUserResponseDto[]>{
        return this.taskStaffService.getTasksByUser(id);
    }



    @Get('proyectos/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Obtener proyectos asignados al usuario' })
    @ApiResponse({ status: 200, description: 'Listado de proyectos', type: ProjectByUserResponseDto, isArray: true })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas para este usuario' })
    getProjectsByUser(
    @Param('id', new ParseUUIDPipe()) id: string
    ): Promise<ProjectByUserResponseDto[]> {
        return this.taskStaffService.getProjectsByUser(id);
    }


    @ApiOperation({summary:"Actualizar una tarea en específico"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Patch('/update/:id')
    @Patch() //Usa @Patch() sin :id, porque estás usando combinación de task + staff como identificador.
    updateByPair(@Body() dto: UpdateTaskStaffDto) {
        return this.taskStaffService.update(dto);//Llama al servicio pasando el DTO correctamente.
    }


    @ApiOperation({summary:"Borrar una relación tarea-empleado"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Delete('/delete')
    deleteByTaskAndStaff(@Body() dto: DeleteTaskStaffDto) {
        return this.taskStaffService.deleteByTaskAndStaff(dto);
    }
}
