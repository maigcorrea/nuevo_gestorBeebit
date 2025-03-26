import { Controller, Get, Post, Delete, Put, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskStaffService } from './task-staff.service';
import { CreateTaskStaffDto } from './dto/create-task-staff.dto';
import { TaskStaffResponseDto } from './dto/task-staff-response.dto';
import { UpdateTaskStaffDto } from './dto/update-task-staff.dto';
import { DeleteTaskStaffDto } from './dto/delete-task-staff.dto';
import { TaskStaff } from './entities/taskStaff.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { TaskWithStaffResponseDto } from './dto/task-with-staff.response.dto';

@ApiTags('Task_Staff')
@Controller("task_staff")

export class TaskStaffController{
    constructor(private readonly taskStaffService: TaskStaffService) {}

    @Post()
    create(@Body() dto: CreateTaskStaffDto) {
        return this.taskStaffService.create(dto);
    }

    @Get()
    findAll(): Promise<TaskStaffResponseDto[]> {
        return this.taskStaffService.findAll();
    }


    @Get('por-tarea')
    findGroupedByTask(): Promise<TaskWithStaffResponseDto[]> {
        return this.taskStaffService.findGroupedByTask();
    }



    @Patch('/update/:id')
    @Patch() //Usa @Patch() sin :id, porque estás usando combinación de task + staff como identificador.
    updateByPair(@Body() dto: UpdateTaskStaffDto) {
        return this.taskStaffService.update(dto);//Llama al servicio pasando el DTO correctamente.
    }


    @Delete('/delete')
    deleteByTaskAndStaff(@Body() dto: DeleteTaskStaffDto) {
        return this.taskStaffService.deleteByTaskAndStaff(dto);
    }
}
