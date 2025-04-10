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
import { CheckAbilities } from 'src/casl/check-abilities.decorator';
import { AbilitiesGuard } from 'src/casl/abilities.guard';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { Staff } from 'src/staff/entities/staff.entity';


@ApiTags('Tasks')
@Controller("tasks")


export class TaskController{
    constructor(private readonly taskService: TaskService,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'create', subject: Task })
    @Post()

    @ApiOperation({summary:"Crear tarea"})
    @ApiResponse({ status: 201, description: 'Tarea creada correctamente', type: TaskResponseDto})
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createTaskDto: CreateTaskDto, @Req() req:Request) {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff)
        // Recibe el cuerpo de la petición (body) y lo convierte en un CreateTaskDto automáticamente.
        // Llama al método create() del servicio, pasándole el DTO.
        return this.taskService.create(createTaskDto, ability);
    }

    //ENdpoint para obtener todas las tareas
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: Task })
    @Get()
    
    @ApiOperation({summary:"Listar todas las tareas"})
    @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas' })
    async findAll(@Req() req: Request): Promise<Task[]> {
        const ability=this.caslAbilityFactory.createForUser(req.user as Staff)
        const projects = await this.taskService.findAll(ability);
        
        if (!projects.length) {
            throw new NotFoundException('No se encontraron proyectos');
        }
        
        return projects;
    }

    // Endpoint para mostrar tareas en función de un proyecto asociado
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: Task })
    @Get(":id_proyecto")
    @ApiOperation({summary:"Obtener tareas para un proyecto determinado"})
    @ApiResponse({ status: 201, description: 'Lista de tareas', type: Task})
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async findByProject(@Param('id_proyecto', new ParseUUIDPipe()) id_proyecto: string, @Req() req: Request): Promise<Task[]> {
        const ability=this.caslAbilityFactory.createForUser(req.user as Staff)
        const tasks = await this.taskService.findByProject(id_proyecto,ability);
        //if (!tasks.length) {
            //throw new NotFoundException('No se encontraron tareas asociadas al proyecto');
        //}

        return tasks;
    }



    //Endpoint para actualizar una tarea en concreto
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: Task })
    @Put("/update/:id_tarea")
    @ApiOperation({summary:"Actualizar una tarea determinada"})
    @ApiResponse({ status: 201, description: 'Tarea actualizada con éxito', type: Task})
    @ApiResponse({ status: 400, description: 'Proyecto no encontrado' })
    async updateTask(@Param('id_tarea', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateTaskDto, @Req() req: Request) {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);

        return this.taskService.updateTask(id, updateDto, ability);
    }


    //Endpoint para actualizar sólo el estado de una tarea en concreto
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: Task })
    @Patch(':id/status')
    @ApiOperation({summary:"Actualizar el estado de una tarea determinada"})
    updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req: Request
    ) {
        const ability=this.caslAbilityFactory.createForUser(req.user as Staff)
        console.log('En controlador');
    return this.taskService.updateTaskStatus(id, dto, ability);
    }


    //Endpoint para borrar una tarea en concreto
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'delete', subject: Task })
    @Delete("/delete/:id_tarea")
    @ApiOperation({summary:"Borrar una tarea determinada"})
    @ApiResponse({ status: 201, description: 'Tarea eliminada con éxito'})
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    async deleteTask(@Param('id_tarea', new ParseUUIDPipe()) id: string, @Req() req:Request) {
        const ability=this.caslAbilityFactory.createForUser(req.user as Staff)
        return this.taskService.deleteTask(id,ability);
    }


    //Endpoint para editar y actualizar el estado y prioridad de una tarea en concreto
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: Task })
    @Patch(':id/update-status-priority')
    @ApiOperation({summary:"Actualizar el estado y prioridad para una tarea"})
    @ApiResponse({ status: 201, description: 'Tarea modificada con éxito'})
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    updateStatusAndPriority(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateTaskStatusPriorityDto,
        @Req() req:Request
    ) {
        const ability=this.caslAbilityFactory.createForUser(req.user as Staff)
        return this.taskService.updateStatusAndPriority(id, dto.status, dto.priority,ability);
    }

}
