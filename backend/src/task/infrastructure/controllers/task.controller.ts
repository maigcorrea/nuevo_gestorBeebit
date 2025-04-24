import {
    Controller,
    Post,
    Body,
    Req,
    Get,
    UseGuards,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Patch,
    Delete
  } from '@nestjs/common';
  import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
  import { AbilitiesGuard } from 'src/casl/abilities.guard';
  import { CheckAbilities } from 'src/casl/check-abilities.decorator';
  import { Request } from 'express';
  import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
  import { CreateTaskDto } from '../dto/create-task.dto';
  import { TaskResponseDto } from '../dto/task-response.dto';
  import { CaslAbilityFactory } from '../../../casl/casl-ability.factory';
  import { TaskMapper } from '../mappers/task.mapper';
  import { Staff } from '../../../staff/domain/entities/staff.entity';
  import { FindAllTasksUseCase } from 'src/task/application/use-cases/find-all-tasks.use-case';
  import { TaskTypeOrmEntity } from '../persistence/task.typeorm.entity';
  import { FindTasksByProjectUseCase } from 'src/task/application/use-cases/find-tasks-by-project.use-case';
  import { UpdateTaskDto } from '../dto/update-task.dto';
  import { UpdateTaskUseCase } from 'src/task/application/use-cases/update-task.use-case';
  import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
  import { UpdateTaskStatusUseCase } from 'src/task/application/use-cases/update-task-status.use-case';
  import { DeleteTaskUseCase } from 'src/task/application/use-cases/delete-task.use-case';
  import { Task as TaskSubject } from '../persistence/task.typeorm.entity';
  import { Task } from 'src/task/domain/entities/task.entity';
  import { UpdateTaskStatusPriorityDto } from '../dto/update-task-status-priority.dto';
  import { UpdateStatusAndPriorityUseCase } from 'src/task/application/use-cases/update-status-and-priority.use-case';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';

  @ApiTags('Tasks')
  @Controller('tasks')
  export class TaskController {
    constructor(
      private readonly createTaskUseCase: CreateTaskUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
      private readonly findAllTasksUseCase: FindAllTasksUseCase,
      private readonly findTasksByProjectUseCase: FindTasksByProjectUseCase,
      private readonly updateTaskUseCase: UpdateTaskUseCase,
      private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
      private readonly deleteTaskUseCase: DeleteTaskUseCase,
      private readonly updateStatusAndPriorityUseCase: UpdateStatusAndPriorityUseCase,
    ) {}
  
    @Post()
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Crear tarea' })
    @ApiResponse({ status: 201, description: 'Tarea creada correctamente', type: TaskResponseDto })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request): Promise<TaskResponseDto> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
  
      const task = await this.createTaskUseCase.execute(createTaskDto, ability);
  
      return TaskMapper.toResponseDto(task);
    }





    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskTypeOrmEntity }) // 👈 Importante usar la entidad TypeORM
    @Get()
    @ApiOperation({ summary: 'Listar todas las tareas' })
    @ApiResponse({ status: 200, description: 'Listado de tareas', type: [TaskResponseDto] })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas' })
    async findAll(@Req() req: Request): Promise<TaskResponseDto[]> {
        const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);

        const tasks = await this.findAllTasksUseCase.execute(ability);

        if (!tasks.length) {
            throw new NotFoundException('No se encontraron tareas');
        }

        return tasks.map(task => TaskMapper.toResponseDto(task));
    }



    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskTypeOrmEntity })
    @Get('project/:id_proyecto')
    @ApiOperation({ summary: 'Obtener tareas para un proyecto determinado' })
    @ApiResponse({ status: 200, description: 'Lista de tareas', type: [TaskResponseDto] })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas' })
    async findByProject(
    @Param('id_proyecto', new ParseUUIDPipe()) id_proyecto: string,
    @Req() req: Request,
    ): Promise<TaskResponseDto[]> {
    const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);

    const tasks = await this.findTasksByProjectUseCase.execute(id_proyecto, ability);

    return tasks.map(TaskMapper.toResponseDto);
    }





    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: TaskTypeOrmEntity })
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una tarea determinada' })
    @ApiResponse({ status: 200, description: 'Tarea actualizada con éxito' })
    @ApiResponse({ status: 404, description: 'Tarea o proyecto no encontrado' })
    async updateTask(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() updateDto: UpdateTaskDto,
      @Req() req: Request,
    ): Promise<{ message: string }> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.updateTaskUseCase.execute(id, updateDto, ability);
    }





    @Patch(':id/status')
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: TaskTypeOrmEntity })
    @ApiOperation({ summary: 'Actualizar el estado de una tarea determinada' })
    @ApiResponse({ status: 200, description: 'Estado de la tarea actualizado correctamente' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    async updateTaskStatus(
      @Param('id') id: string,
      @Body() dto: UpdateTaskStatusDto,
      @Req() req: Request,
    ) {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.updateTaskStatusUseCase.execute(id, dto, ability);
    }






    @Delete(':id')
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'delete', subject: Task })
    @ApiOperation({ summary: 'Borrar una tarea determinada' })
    @ApiResponse({ status: 200, description: 'Tarea eliminada con éxito' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    async deleteTask(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Req() req: Request
    ) {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.deleteTaskUseCase.execute(id, ability);
    }



    @Patch(':id/update-status-priority')
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: Task })
    @ApiOperation({ summary: 'Actualizar el estado y prioridad para una tarea' })
    @ApiResponse({ status: 201, description: 'Tarea modificada con éxito' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    async updateStatusAndPriority(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() dto: UpdateTaskStatusPriorityDto,
      @Req() req: Request,
    ) {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      const updatedTask = await this.updateStatusAndPriorityUseCase.execute(
        id,
        dto.status,
        dto.priority,
        ability,
      );
      return TaskMapper.toResponseDto(updatedTask); // si quieres devolver TaskResponseDto limpio
    }


  }
  