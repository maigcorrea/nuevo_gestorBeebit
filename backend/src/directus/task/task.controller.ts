import { Controller, Patch, Param, Body, Req, UnauthorizedException, Get, Delete, Post } from '@nestjs/common';
import { UpdateStatusAndPriorityUseCase } from './use-cases/update-status-and-priority.use-case';
import { UpdateStatusPriorityDto } from './dto/update-status-priority.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskStatusUseCase } from './use-cases/update-task-status.use-case';
import { FindAllTasksUseCase } from './use-cases/find-all-tasks.use-case';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';

@ApiTags('Directus - Task')
@Controller('directus/task')
export class TaskController {
  constructor(
    private readonly updateStatusAndPriorityUseCase: UpdateStatusAndPriorityUseCase,
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private readonly findAllTasksUseCase: FindAllTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
  ) {}

  @ApiOperation({ summary: 'Actualizar estado y prioridad de una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada correctamente' })
  @ApiBearerAuth('jwt')
  @Patch(':id/update-status-priority')
  async updateStatusAndPriority(
    @Param('id') id: string,
    @Body() updateDto: UpdateStatusPriorityDto,
    @Req() req: Request,
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    return this.updateStatusAndPriorityUseCase.execute(id, updateDto.status, updateDto.priority, token);
  }



  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req: Request,
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    return this.updateTaskStatusUseCase.execute(id, dto, token);
  }




  @Get()
  async findAll(@Req() req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const accessToken = authorization.split(' ')[1];
    return this.findAllTasksUseCase.execute(accessToken);
  }





  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada correctamente' })
  @ApiBearerAuth('jwt')
  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    return this.updateTaskUseCase.execute(id, dto, token);
  }





  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada correctamente' })
  @ApiBearerAuth('jwt')
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Req() req: Request) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    return this.deleteTaskUseCase.execute(id, token);
  }
  


  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada correctamente' })
  @ApiBearerAuth('jwt')
  @Post('crear')
  async createTask(
    @Body() dto: CreateTaskDto,
    @Req() req: Request,
  ) {
    console.log('📥 DTO recibido en backend:', dto); 
    
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    console.log('✅ DTO recibido:', dto);

    return this.createTaskUseCase.execute(dto, token);
  }
}
