import { Controller, Get, Post, Delete, Put, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './entities/task.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskStatusPriorityDto } from './dto/update-task-status-priority.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ParseUUIDPipe } from '@nestjs/common';


@ApiTags('Tasks')
@Controller("tasks")


export class TaskController{
    constructor(private readonly taskService: TaskService) {}

    @Post()

    @ApiOperation({summary:"Crear tarea"})
    @ApiResponse({ status: 201, description: 'Tarea creada correctamente', type: TaskResponseDto})
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createTaskDto: CreateTaskDto) {
        // Recibe el cuerpo de la petición (body) y lo convierte en un CreateTaskDto automáticamente.
        // Llama al método create() del servicio, pasándole el DTO.
        return this.taskService.create(createTaskDto);
    }

    //ENdpoint para obtener todas las tareas
    @Get()
    
    @ApiOperation({summary:"Listar todas las tareas"})
    @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas' })
    async findAll(): Promise<Task[]> {
        const projects = await this.taskService.findAll();
        
        if (!projects.length) {
            throw new NotFoundException('No se encontraron proyectos');
        }
        
        return projects;
    }

    // Endpoint para mostrar tareas en función de un proyecto asociado
    @Get(":id_proyecto")
    @ApiOperation({summary:"Obtener tareas para un proyecto determinado"})
    @ApiResponse({ status: 201, description: 'Lista de tareas', type: Task})
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async findByProject(@Param('id_proyecto', new ParseUUIDPipe()) id_proyecto: string): Promise<Task[]> {
        const tasks = await this.taskService.findByProject(id_proyecto);
        //if (!tasks.length) {
            //throw new NotFoundException('No se encontraron tareas asociadas al proyecto');
        //}

        return tasks;
    }



    //Endpoint para actualizar una tarea en concreto
    @Put("/update/:id_tarea")
    @ApiOperation({summary:"Actualizar una tarea determinada"})
    @ApiResponse({ status: 201, description: 'Tarea actualizada con éxito', type: Task})
    @ApiResponse({ status: 400, description: 'Proyecto no encontrado' })
    async updateTask(@Param('id_tarea', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateTaskDto) {
        return this.taskService.updateTask(id, updateDto);
    }


    //Endpoint para actualizar sólo el estado de una tarea en concreto
    @Patch(':id/status')
    @ApiOperation({summary:"Actualizar el estado de una tarea determinada"})
    updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    ) {
        console.log('En controlador');
    return this.taskService.updateTaskStatus(id, dto);
    }


    //Endpoint para borrar una tarea en concreto
    @Delete("/delete/:id_tarea")
    @ApiOperation({summary:"Borrar una tarea determinada"})
    @ApiResponse({ status: 201, description: 'Tarea eliminada con éxito'})
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    async deleteTask(@Param('id_tarea', new ParseUUIDPipe()) id: string) {
        return this.taskService.deleteTask(id);
    }


    //Endpoint para editar y actualizar el estado y prioridad de una tarea en concreto
    @Patch(':id/update-status-priority')
    @ApiOperation({summary:"Actualizar el estado y prioridad para una tarea"})
    @ApiResponse({ status: 201, description: 'Tarea modificada con éxito'})
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    updateStatusAndPriority(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateTaskStatusPriorityDto,
    ) {
        console.log("Entra?");
        return this.taskService.updateStatusAndPriority(id, dto.status, dto.priority);
    }

}
