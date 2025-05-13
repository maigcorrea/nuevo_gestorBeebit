import { Controller, Patch, Param, Body, Req, UnauthorizedException, Get } from '@nestjs/common';
import { UpdateStatusAndPriorityUseCase } from './use-cases/update-status-and-priority.use-case';
import { UpdateStatusPriorityDto } from './dto/update-status-priority.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskStatusUseCase } from './use-cases/update-task-status.use-case';
import { FindAllTasksUseCase } from './use-cases/find-all-tasks.use-case';

@ApiTags('Directus - Task')
@Controller('directus/task')
export class TaskController {
  constructor(
    private readonly updateStatusAndPriorityUseCase: UpdateStatusAndPriorityUseCase,
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private readonly findAllTasksUseCase: FindAllTasksUseCase,
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

  
}
