import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { Request } from 'express';
  import { AuthGuard } from '@nestjs/passport';
  
  import { CreateTaskStaffUseCase } from 'src/tasks_staff2/application/use-cases/create-task-staff.use-case';
  import { CreateTaskStaffDto } from '../dto/create-task-staff.dto';
  import { TaskStaffResponseDto } from '../dto/task-staff-response.dto';
  import { TaskStaffMapper } from '../mappers/task-staff.mapper';
  
  import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
  import { AbilitiesGuard } from 'src/casl/abilities.guard';
  import { CheckAbilities } from 'src/casl/check-abilities.decorator';
  import { TaskStaff } from 'src/tasks_staff2/domain/entities/task-staff.entity';
  import { StaffOrmEntity } from 'src/staff2/infrastructure/persistence/staff.orm-entity';
  
  @ApiTags('Task-Staff')
  @Controller('task-staff')
  export class TaskStaffController {
    constructor(
      private readonly createTaskStaffUseCase: CreateTaskStaffUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}
  
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'create', subject: TaskStaff })
    @Post()
    @ApiOperation({ summary: 'Crear relación entre un empleado y una tarea' })
    @ApiResponse({
      status: 201,
      description: 'Relación creada correctamente',
      type: [TaskStaffResponseDto],
    })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Tarea o empleado no encontrado' })
    async create(
      @Body() dto: CreateTaskStaffDto,
      @Req() req: Request,
    ): Promise<TaskStaffResponseDto[]> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      const created = await this.createTaskStaffUseCase.execute(dto, ability);
      return created.map(TaskStaffMapper.toResponseDto);
    }
  }
  