import {
    Controller,
    Post,
    Body,
    Req,
  } from '@nestjs/common';
  import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { Request } from 'express';
  import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
  import { CreateTaskDto } from '../dto/create-task.dto';
  import { TaskResponseDto } from '../dto/task-response.dto';
  import { CaslAbilityFactory } from '../../../casl/casl-ability.factory';
  import { TaskMapper } from '../mappers/task.mapper';
  import { Staff } from '../../../staff2/domain/entities/staff.entity';
  
  @ApiTags('Tasks')
  @Controller('tasks')
  export class TaskController {
    constructor(
      private readonly createTaskUseCase: CreateTaskUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
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
  }
  