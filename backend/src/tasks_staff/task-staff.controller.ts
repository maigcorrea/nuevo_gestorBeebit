import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskStaffService } from './task-staff.service';
import { CreateTaskStaffDto } from './dto/create-task-staff.dto';
//import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStaffResponseDto } from './dto/task-staff-response.dto';
//import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStaff } from './entities/taskStaff.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { TaskWithStaffResponseDto } from './dto/task-with-staff.response.dto';

@ApiTags('Task_Staff')
@Controller("task&staff")

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
}
