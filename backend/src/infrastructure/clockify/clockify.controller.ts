import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ClockifyService } from './clockyfy.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Clockify')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller('clockify')
export class ClockifyController {
  constructor(private readonly clockifyService: ClockifyService) {}

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
}
