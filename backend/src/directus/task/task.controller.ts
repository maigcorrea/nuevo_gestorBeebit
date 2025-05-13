import { Controller, Patch, Param, Body, Req, UnauthorizedException } from '@nestjs/common';
import { UpdateStatusAndPriorityUseCase } from './use-cases/update-status-and-priority.use-case';
import { UpdateStatusPriorityDto } from './dto/update-status-priority.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Directus - Task')
@Controller('directus/task')
export class TaskController {
  constructor(
    private readonly updateStatusAndPriorityUseCase: UpdateStatusAndPriorityUseCase,
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
}
