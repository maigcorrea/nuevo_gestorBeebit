import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam
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

  import { FindAllTaskStaffUseCase } from 'src/tasks_staff2/application/use-cases/find-all-task-staff.use-case';

  import { TaskWithStaffResponseDto } from '../dto/task-with-staff-response.dto';
  import { FindTaskStaffGroupedByTaskUseCase } from 'src/tasks_staff2/application/use-cases/find-grouped-by-task.use-case';

  import { TaskByUserResponseDto } from '../dto/task-by-user-response.dto';
  import { GetTasksByUserUseCase } from 'src/tasks_staff2/application/use-cases/get-tasks-by-user.use-case';

  import { ProjectByUserResponseDto } from '../dto/project-by-user-response.dto';
  import { GetProjectsByUserUseCase } from 'src/tasks_staff2/application/use-cases/get-projects-by-user.use-case';

  import { UpdateTaskStaffUseCase } from 'src/tasks_staff2/application/use-cases/update-task-staff.use-case';
  import { UpdateTaskStaffDto } from '../dto/update-task-staff.dto';
  
  @ApiTags('Task-Staff')
  @Controller('task-staff')
  export class TaskStaffController {
    constructor(
      private readonly createTaskStaffUseCase: CreateTaskStaffUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
      private readonly findAllTaskStaffUseCase: FindAllTaskStaffUseCase,
      private readonly findTaskStaffGroupedByTaskUseCase: FindTaskStaffGroupedByTaskUseCase,
      private readonly getTasksByUserUseCase: GetTasksByUserUseCase,
      private readonly getProjectsByUserUseCase: GetProjectsByUserUseCase,
      private readonly updateTaskStaffUseCase: UpdateTaskStaffUseCase,
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





    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @ApiOperation({ summary: 'Obtener todas las relaciones tarea-empleado' })
    @ApiResponse({ status: 200, type: [TaskStaffResponseDto] })
    @ApiResponse({ status: 403, description: 'No tienes permiso' })
    @Get('todo')
    async findAll(@Req() req: Request): Promise<TaskStaffResponseDto[]> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.findAllTaskStaffUseCase.execute(ability);
    }





    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @ApiOperation({ summary: 'Obtener todas las relaciones por tarea (tarea → empleados)' })
    @ApiResponse({ status: 200, type: [TaskWithStaffResponseDto] })
    @ApiResponse({ status: 403, description: 'No tienes permiso' })
    @Get('por-tarea')
    async findGroupedByTask(@Req() req: Request): Promise<TaskWithStaffResponseDto[]> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.findTaskStaffGroupedByTaskUseCase.execute(ability);
    }





    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @ApiOperation({ summary: 'Obtener las tareas asignadas a un empleado concreto' })
    @ApiResponse({ status: 200, description: 'Listado de tareas asignadas al usuario', type: [TaskByUserResponseDto] })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas o no tienes permisos' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del usuario' })
    @Get('por-usuario/:id')
    async getTasksByUser(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Req() req: Request,
    ): Promise<TaskByUserResponseDto[]> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.getTasksByUserUseCase.execute(id, ability);
    }





    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @Get('proyectos/:id')
    @ApiOperation({ summary: 'Obtener proyectos asignados al usuario' })
    @ApiResponse({
      status: 200,
      description: 'Listado de proyectos',
      type: ProjectByUserResponseDto,
      isArray: true,
    })
    @ApiResponse({
      status: 404,
      description: 'No se encontraron tareas para este usuario',
    })
    async getProjectsByUser(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Req() req: Request,
    ): Promise<ProjectByUserResponseDto[]> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.getProjectsByUserUseCase.execute(id, ability);
    }




    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: TaskStaff })
    @Patch() // No necesitas :id, ya que actualizas usando task + staff como claves
    @ApiOperation({ summary: 'Actualizar relación tarea-empleado (por combinación de IDs)' })
    @ApiResponse({ status: 200, description: 'Relación actualizada con éxito' })
    @ApiResponse({ status: 404, description: 'Relación no encontrada' })
    updateByPair(
      @Body() dto: UpdateTaskStaffDto,
      @Req() req: Request
    ) {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.updateTaskStaffUseCase.execute(dto, ability);
    }
  }
  