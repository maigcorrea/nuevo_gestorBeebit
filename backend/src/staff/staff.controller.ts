import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';


@ApiTags('Staff')
@Controller("staff")
export class StaffController{
    constructor(private readonly staffService: StaffService) {}

    @Post()

    @ApiOperation({summary:"Introducir empleado en el sistema"})
    @ApiResponse({ status: 201, description: 'Empleado creado correctamente', type: StaffResponseDto})
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createStaffDto: CreateStaffDto) {
        console.log("Hola")
        // Recibe el cuerpo de la petición (body) y lo convierte en un CreateStaffDto automáticamente.
        // Llama al método create() del servicio, pasándole el DTO.
        return this.staffService.create(createStaffDto);
    }


    //Endpoint para mostrar todos los usuarios de la base de datos.
    @Get("/all")
    @ApiOperation({summary:"Mostrar todos los empleados"})
    @ApiResponse({ status: 200, description: 'Listado de empleados', type: [StaffResponseDto] })
    @ApiResponse({ status: 404, description: 'No se encontraron empleados' })

    findAll() {
        // Llama al método findAll() del servicio, que devuelve un array de usuarios.
        return this.staffService.findAll();
    }
}