import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetTasksByUserUseCase } from './use-cases/get-tasks-by-user.user-case';
import { Request } from 'express';
import { TaskByUserResponseDto } from './dto/task-by-user-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnauthorizedException } from '@nestjs/common';

@ApiTags('Directus - Tasks Staff')
@Controller('directus/tasks-staff')
export class TasksStaffController {
  constructor(
    private readonly getTasksByUserUseCase: GetTasksByUserUseCase,
  ) {}

  @ApiOperation({ summary: 'Obtener las tareas asignadas al usuario logueado' })
  @ApiResponse({ status: 200, description: 'Listado de tareas asignadas', type: [TaskByUserResponseDto] })
  @Get('me')
  async getMyTasks(@Req() req: Request): Promise<TaskByUserResponseDto[]> {
    const authorization= req.headers.authorization;

    if (!authorization) {
        throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];
    
    // Decodificar el token para obtener el id del usuario
    const decoded = decodeJwtPayload(token);
    const userId = decoded.id; // Directus mete el id del user aquí

    return this.getTasksByUserUseCase.execute(token, userId);
  }
}



// Función auxiliar
function decodeJwtPayload(token: string): any {
    const payloadBase64 = token.split('.')[1];
    const payloadBuffer = Buffer.from(payloadBase64, 'base64');
    const payloadJson = payloadBuffer.toString('utf-8');
    return JSON.parse(payloadJson);
  }