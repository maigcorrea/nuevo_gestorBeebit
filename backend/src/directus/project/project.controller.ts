// src/directus/project/project.controller.ts

import { Controller, Get, Req, UnauthorizedException, Patch, Param, Body, Delete } from '@nestjs/common';
import { Request } from 'express';
import { FindAllProjectsUseCase } from './use-cases/find-all-projects.use-case';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectUseCase } from './use-cases/update-project.use-case';
import { DeleteProjectUseCase } from './use-cases/delete-project.use-case';

@ApiTags('Directus - Project')
@Controller('directus/project')
export class ProjectController {
  constructor(
    private readonly findAllProjectsUseCase: FindAllProjectsUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
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





  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado correctamente' })
  @ApiBearerAuth('jwt')
  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    return this.updateProjectUseCase.execute(id, dto, token);
  }




  @ApiOperation({ summary: 'Eliminar un proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado correctamente' })
  @ApiBearerAuth('jwt')
  @Delete(':id')
  async deleteProject(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    return this.deleteProjectUseCase.execute(id, token);
  }


}
