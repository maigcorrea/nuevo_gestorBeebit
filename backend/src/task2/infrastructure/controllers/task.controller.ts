import {
    Controller,
    Post,
    Body,
    Req,
    Get,
    UseGuards,
    NotFoundException
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
  import { Staff } from '../../../staff2/domain/entities/staff.entity';
  import { FindAllTasksUseCase } from 'src/task2/application/use-cases/find-all-tasks.use-case';
  import { TaskTypeOrmEntity } from '../persistence/task.typeorm.entity';
  
  @ApiTags('Tasks')
  @Controller('tasks')
  export class TaskController {
    constructor(
      private readonly createTaskUseCase: CreateTaskUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
      private readonly findAllTasksUseCase: FindAllTasksUseCase,
    ) {}
  
    @Post()
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Crear tarea' })
    @ApiResponse({ status: 201, description: 'Tarea creada correctamente', type: TaskResponseDto })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request): Promise<TaskResponseDto> {
      const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
  
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
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);

        const tasks = await this.findAllTasksUseCase.execute(ability);

        if (!tasks.length) {
            throw new NotFoundException('No se encontraron tareas');
        }

        return tasks.map(task => TaskMapper.toResponseDto(task));
    }

  }
  