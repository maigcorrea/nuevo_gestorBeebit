import { Controller, Get, Req, UseGuards, Post, Res, Body } from '@nestjs/common';
import { GetTasksByUserUseCase } from './use-cases/get-tasks-by-user.user-case';
import { Request } from 'express';
import { TaskByUserResponseDto } from './dto/task-by-user-response.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UnauthorizedException } from '@nestjs/common';
import { ProjectByUserResponseDto } from './dto/project-by-user-response.dto';
import { GetProjectsByUserUseCase } from './use-cases/get-projects-by-user.use-case';

@ApiTags('Directus - Tasks Staff')
@Controller('directus/tasks-staff')
export class TasksStaffController {
  constructor(
    private readonly getTasksByUserUseCase: GetTasksByUserUseCase,
    private readonly getProjectsByUserUseCase: GetProjectsByUserUseCase,
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




  
  @ApiOperation({ summary: 'Obtener los proyectos asignados al usuario logueado' })
  @ApiResponse({ status: 200, description: 'Listado de proyectos asignados', type: [ProjectByUserResponseDto] })
  @Get('proyectos')
  async getMyProjects(@Req() req: Request): Promise<ProjectByUserResponseDto[]> {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    // Decodificamos el token para sacar el id del usuario
    const decoded = decodeJwtPayload(token);
    const userId = decoded.id;

    return this.getProjectsByUserUseCase.execute(token, userId);
  }


  
  @ApiOperation({ summary: 'Exportar proyectos seleccionados a Excel' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado correctamente' })
  @Post('export-excel')
  async exportToExcel(
    @Req() req: Request,
    @Res() res: Response,
    @Body('ids') ids: string[],
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    const buffer = await this.exportProjectsToExcelUseCase.execute(ids, token);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=proyectos.xlsx',
    });

    res.end(buffer);
  }
}



// Función auxiliar para decodificar el token
function decodeJwtPayload(token: string): any {
    const payloadBase64 = token.split('.')[1];
    const payloadBuffer = Buffer.from(payloadBase64, 'base64');
    const payloadJson = payloadBuffer.toString('utf-8');
    return JSON.parse(payloadJson);
  }