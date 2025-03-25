import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';


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

    // Endpoint para mostrar tareas en función de un proyecto asociado
    @Get(":id_proyecto")
    @ApiOperation({summary:"Obtener tareas para un proyecto determinado"})
    @ApiResponse({ status: 201, description: 'Lista de tareas', type: Task})
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async findByProject(@Param('id_proyecto', ParseIntPipe) id_proyecto: number): Promise<Task[]> {
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
    async updateTask(@Param('id_tarea', ParseIntPipe) id: number, @Body() updateDto: UpdateTaskDto) {
        return this.taskService.updateTask(id, updateDto); //Se parsea a string el id por si viene en number
    }




    //Endpoint para borrar una tarea en concreto
    @Delete("/delete/:id_tarea")
    @ApiOperation({summary:"Borrar una tarea determinada"})
    @ApiResponse({ status: 201, description: 'Tarea eliminada con éxito'})
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    async deleteTask(@Param('id_tarea', ParseIntPipe) id: number) {
        return this.taskService.deleteTask(id); // conviertes el string a número
    }


}
