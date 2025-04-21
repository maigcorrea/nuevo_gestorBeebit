import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    ForbiddenException,
    NotFoundException,
    Get,
    Param,
    ParseUUIDPipe
  } from '@nestjs/common';
  import { Request } from 'express';
  import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
  import { AuthGuard } from '@nestjs/passport';
  import { CheckAbilities } from 'src/casl/check-abilities.decorator';
  import { AbilitiesGuard } from 'src/casl/abilities.guard';
  import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
  import { CreateTaskDto } from '../dto/create-task.dto';
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { Task } from '../../domain/entities/task.entity';
  import { Task as TaskModel } from '../../domain/entities/task.entity';
  import { Staff } from 'src/staff2/domain/entities/staff.entity';
  import { FindAllTasksUseCase } from 'src/task2/application/use-cases/find-all-tasks.use-case';
  import { TaskResponseDto } from '../dto/task-response.dto';
  import { FindTasksByProjectUseCase } from 'src/task2/application/use-cases/find-tasks-by-project.use-case';
  
  @ApiTags('Tareas')
  @Controller('task')
  export class TaskController {
    constructor(
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly findAllTasksUseCase: FindAllTasksUseCase,
        private readonly findTasksByProjectUseCase: FindTasksByProjectUseCase,
    ) {}
  
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'create', subject: TaskModel })
    @Post()
    @ApiOperation({ summary: 'Crear tarea' })
    @ApiResponse({ status: 201, description: 'Tarea creada correctamente', type: TaskResponseDto })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(
      @Body() createTaskDto: CreateTaskDto,
      @Req() req: Request
    ): Promise<TaskResponseDto> {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
  
      const task = await this.createTaskUseCase.execute(createTaskDto, ability);
      return TaskResponseDto.fromEntity(task);
    }








    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: Task })
    @Get()
    @ApiOperation({ summary: 'Listar todas las tareas' })
    @ApiResponse({
      status: 200,
      description: 'Listado de tareas',
      type: [TaskResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas' })
    async findAll(@Req() req: Request): Promise<TaskResponseDto[]> {
      const ability = this.caslAbilityFactory.createForUser(req.user as any);
  
      const tasks = await this.findAllTasksUseCase.execute(ability);
  
      if (!tasks.length) {
        throw new NotFoundException('No se encontraron tareas');
      }
  
      return tasks.map(TaskResponseDto.fromEntity);
    }







    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: Task })
    @Get('por-proyecto/:id_proyecto')
    @ApiOperation({ summary: 'Obtener tareas para un proyecto determinado' })
    @ApiResponse({
        status: 200,
        description: 'Lista de tareas asociadas al proyecto',
        type: [TaskResponseDto],
    })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas' })
    async findByProject(
        @Param('id_proyecto', new ParseUUIDPipe()) id_proyecto: string,
        @Req() req: Request,
    ): Promise<TaskResponseDto[]> {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);

        const tasks = await this.findTasksByProjectUseCase.execute(id_proyecto, ability);
        return tasks.map(TaskResponseDto.fromEntity);
    }
  }
  