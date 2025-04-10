import { Controller, Get, Post, Delete, Put, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TaskStaffService } from './task-staff.service';
import { CreateTaskStaffDto } from './dto/create-task-staff.dto';
import { TaskStaffResponseDto } from './dto/task-staff-response.dto';
import { UpdateTaskStaffDto } from './dto/update-task-staff.dto';
import { DeleteTaskStaffDto } from './dto/delete-task-staff.dto';
import { TaskStaff } from './entities/taskStaff.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { TaskWithStaffResponseDto } from './dto/task-with-staff.response.dto';
import { TaskByUserResponseDto } from './dto/task-by-user-response.dto';
import { ProjectByUserResponseDto } from './dto/project-by-user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ParseUUIDPipe } from '@nestjs/common';
import { CheckAbilities } from 'src/casl/check-abilities.decorator';
import { AbilitiesGuard } from 'src/casl/abilities.guard';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Request, Response } from 'express';
import { Req, Res } from '@nestjs/common';
import { Staff } from 'src/staff/entities/staff.entity';

@ApiTags('Task_Staff')
@Controller("tasks_staff")

export class TaskStaffController{
    constructor(private readonly taskStaffService: TaskStaffService,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'create', subject: TaskStaff })
    @Post()
    @ApiOperation({summary:"Crear relación entre un empleado y una tarea"})
    @ApiResponse({ status: 200, description: 'Relación creada correctamente'})
    @ApiResponse({ status: 404, description: 'Error. No se ha podido crear la relación' })
    create(@Body() dto: CreateTaskStaffDto, @Req() req: Request) {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.taskStaffService.create(dto,ability);
    }


    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @ApiOperation({summary:"Obtener todas las relaciones tarea-empleado"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Get('todo')
    findAll(@Req() req: Request): Promise<TaskStaffResponseDto[]> {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.taskStaffService.findAll(ability);
    }



    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @ApiOperation({summary:"Obtener todas las relaciones por tarea (tarea-[empleados])"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Get('por-tarea')
    findGroupedByTask(@Req() req: Request): Promise<TaskWithStaffResponseDto[]> {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.taskStaffService.findGroupedByTask(ability);
    }


    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @ApiOperation({summary: "Obtener las tareas asignadas a un empleado concreto"})
    @ApiResponse({status:404, description:"Error"})
    @Get("por-usuario/:id")
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del usuario' })
    getTasksByUser( @Param('id', new ParseUUIDPipe()) id:string, @Req() req: Request):Promise<TaskByUserResponseDto[]>{
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.taskStaffService.getTasksByUser(id, ability);
    }


    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: TaskStaff })
    @Get('proyectos/:id')
    @ApiOperation({ summary: 'Obtener proyectos asignados al usuario' })
    @ApiResponse({ status: 200, description: 'Listado de proyectos', type: ProjectByUserResponseDto, isArray: true })
    @ApiResponse({ status: 404, description: 'No se encontraron tareas para este usuario' })
    getProjectsByUser(
    @Param('id', new ParseUUIDPipe(),) id: string, @Req() req: Request): Promise<ProjectByUserResponseDto[]> {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.taskStaffService.getProjectsByUser(id, ability);
    }


    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: TaskStaff })
    @ApiOperation({summary:"Actualizar una tarea en específico"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Patch('/update/:id')
    @Patch() //Usa @Patch() sin :id, porque estás usando combinación de task + staff como identificador.
    updateByPair(@Body() dto: UpdateTaskStaffDto, @Req() req: Request) {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.taskStaffService.update(dto, ability);//Llama al servicio pasando el DTO correctamente.
    }


    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'delete', subject: TaskStaff })
    @ApiOperation({summary:"Borrar una relación tarea-empleado"})
    @ApiResponse({ status: 404, description: 'Error.' })
    @Delete('/delete')
    deleteByTaskAndStaff(@Body() dto: DeleteTaskStaffDto, @Req() req: Request) {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.taskStaffService.deleteByTaskAndStaff(dto, ability);
    }

    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
@CheckAbilities({ action: 'read', subject: TaskStaff })
@Post('export-excel')
@ApiOperation({ summary: 'Exportar proyectos seleccionados a Excel' })
@ApiBearerAuth('jwt')
@ApiResponse({ status: 200, description: 'Archivo Excel generado' })
async exportToExcel(
  @Body('ids') ids: string[],
  @Res() res: Response,
  @Req() req: Request,
) {
  const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
  const buffer = await this.taskStaffService.exportProjectsToExcel(ids, ability);

  res.set({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename=proyectos.xlsx',
  });

  res.end(buffer);
}






@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
@CheckAbilities({ action: 'read', subject: TaskStaff })
@Post('export-pdf')
@ApiOperation({ summary: 'Exportar proyectos a PDF' })
@ApiBearerAuth('jwt')
@ApiResponse({ status: 200, description: 'PDF generado' })
async exportProjectsPDF(
  @Body('ids') ids: string[],
  @Res() res: Response,
  @Req() req: Request
) {
  const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
  const pdfBuffer = await this.taskStaffService.exportProjectsToPDF(ids, ability);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=proyectos.pdf');
  res.end(pdfBuffer);
}


}
