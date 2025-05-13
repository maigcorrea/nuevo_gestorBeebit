// src/directus/project/project.controller.ts

import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { FindAllProjectsUseCase } from './use-cases/find-all-projects.use-case';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Directus - Project')
@Controller('directus/project')
export class ProjectController {
  constructor(
    private readonly findAllProjectsUseCase: FindAllProjectsUseCase,
  ) {}

  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  @ApiResponse({ status: 200, description: 'Listado de proyectos obtenido correctamente' })
  @ApiBearerAuth('jwt')
  @Get()
  async findAll(@Req() req: Request) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const accessToken = authorization.split(' ')[1];
    return this.findAllProjectsUseCase.execute(accessToken);
  }
}
