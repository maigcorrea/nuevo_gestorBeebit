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
    Delete,
    Res
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
  import { Response } from 'express';
  
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

  import { DeleteTaskStaffDto } from '../dto/delete-task-staff.dto';
  import { DeleteTaskStaffUseCase } from 'src/tasks_staff2/application/use-cases/delete-task-staff.use-case';


  import { FindTasksDueTomorrowUseCase } from 'src/tasks_staff2/application/use-cases/find-tasks-due-tomorrow.use-case';

  import { ExportProjectsToExcelUseCase } from 'src/tasks_staff2/application/use-cases/export-projects-to-excel.use-case';
  import { ExportProjectsToPDFUseCase } from 'src/tasks_staff2/application/use-cases/export-project-to-pdf.use-case';
  //
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
      private readonly deleteTaskStaffUseCase: DeleteTaskStaffUseCase,
      private readonly findTasksDueTomorrowUseCase: FindTasksDueTomorrowUseCase,
      private readonly exportProjectsToExcelUseCase: ExportProjectsToExcelUseCase,
      private readonly exportProjectsToPDFUseCase: ExportProjectsToPDFUseCase,
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









    @Delete('/delete')
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'delete', subject: TaskStaff })
    @ApiOperation({ summary: 'Borrar una relación tarea-empleado' })
    @ApiResponse({ status: 200, description: 'Relación eliminada correctamente' })
    @ApiResponse({ status: 404, description: 'Relación no encontrada' })
    async deleteByTaskAndStaff(
      @Body() dto: DeleteTaskStaffDto,
      @Req() req: Request,
    ): Promise<{ message: string }> {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      const result = await this.deleteTaskStaffUseCase.execute(dto, ability);
      return { message: result };
    }






    @Get('vencen-manana')
    @ApiOperation({ summary: 'Obtener tareas que vencen mañana' })
    @ApiResponse({
      status: 200,
      description: 'Lista de tareas que vencen mañana',
      schema: {
        example: [
          {
            title: 'Completar informe',
            deadline: '2025-04-23',
            email: 'empleado@empresa.com',
          },
        ],
      },
    })
    async findTasksDueTomorrow(): Promise<{ title: string; deadline: string; email: string }[]> {
      return this.findTasksDueTomorrowUseCase.execute();
    }



    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @Post('export-excel')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Exportar proyectos seleccionados a Excel' })
    @ApiResponse({ status: 200, description: 'Archivo Excel generado correctamente' })
    async exportToExcel(
      @Body('ids') ids: string[],
      @Res() res: Response,
      @Req() req: Request,
    ) {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      const buffer = await this.exportProjectsToExcelUseCase.execute(ids, ability);
  
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=proyectos.xlsx',
      });
  
      res.end(buffer);
    }



    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @Post('export-pdf')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Exportar proyectos seleccionados a PDF' })
    @ApiResponse({ status: 200, description: 'PDF generado correctamente' })
    async exportToPDF(
      @Body('ids') ids: string[],
      @Res() res: Response,
      @Req() req: Request,
    ) {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      const buffer = await this.exportProjectsToPDFUseCase.execute(ids, ability);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=proyectos.pdf',
      });

      res.end(buffer);
    }
  }
  