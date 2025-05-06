import { Controller, Get, UseGuards, Req, Post, Body, BadRequestException } from '@nestjs/common';
import { ClockifyService } from './clockyfy.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { StartTimeEntryDto } from './dto/start-time-entry.dto';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { TASK_REPOSITORY } from 'src/task/domain/token/task-repository.token';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';
import { StaffRepositoryPort } from 'src/staff/domain/ports/staff.repository.port';
import { TaskRepositoryPort } from 'src/task/domain/ports/task.repository.port';
import { ProjectRepositoryPort } from 'src/project/domain/ports/project.repository.port';
import { StopTimeEntryDto } from './dto/stop-time-entry.dto';

@ApiTags('Clockify')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller('clockify')
export class ClockifyController {
  constructor(
    private readonly clockifyService: ClockifyService,
    @Inject(STAFF_REPOSITORY) private readonly staffRepo: StaffRepositoryPort,
    @Inject(TASK_REPOSITORY) private readonly taskRepo: TaskRepositoryPort,
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  @Get('workspaces')
  @ApiOperation({ summary: 'Obtener workspaces de Clockify' })
  @ApiResponse({ status: 200, description: 'Lista de workspaces' })
  async getWorkspaces() {
    return this.clockifyService.getWorkspaces();
  }

  @Get('user')
  @ApiOperation({ summary: 'Obtener información del usuario actual en Clockify' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  async getUser() {
    return this.clockifyService.getUser();
  }


  @Post('/start-time-entry')
  async startTimeEntry(@Body() body: StartTimeEntryDto) {
    const staff = await this.staffRepo.findById(body.staffId);
    const task = await this.taskRepo.findById(body.taskId);

    if (!staff?.clockifyUserId || !task?.clockifyTaskId) {
      throw new BadRequestException('Faltan datos de Clockify para el usuario o la tarea');
    }

    const project = await this.projectRepo.findById(task.associated_project_id);
    if (!project?.clockifyProjectId) {
      throw new BadRequestException('El proyecto no tiene clockifyProjectId');
    }

    return this.clockifyService.startTimeEntry({
      userId: staff.clockifyUserId,
      projectId: project.clockifyProjectId,
      taskId: task.clockifyTaskId,
      description: `Trabajando en ${task.title}`,
    });
  }


  @Post('/stop-time-entry')
  async stopTimeEntry(@Body() body: StopTimeEntryDto) {
    return this.clockifyService.stopTimeEntryById(body.timeEntryId);
  }

}
