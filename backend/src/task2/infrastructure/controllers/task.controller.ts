import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    ForbiddenException,
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
  import { TaskResponseDto } from '../dto/task-response.dto';
  
  @ApiTags('Tareas')
  @Controller('task')
  export class TaskController {
    constructor(
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
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
  }
  