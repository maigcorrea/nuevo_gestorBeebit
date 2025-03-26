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
    async create(@Body() createStaffDto: CreateStaffDto) {
        console.log("Hola")
        // Recibe el cuerpo de la petición (body) y lo convierte en un CreateStaffDto automáticamente.
        // Llama al método create() del servicio, pasándole el DTO.
        const user= await this.staffService.create(createStaffDto);
        return user;
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



    // Mostrar un empleado por ID
    @Get(':id')
    @ApiOperation({ summary: 'Mostrar un empleado por ID' })
    @ApiResponse({ status: 200, description: 'Empleado encontrado', type: StaffResponseDto })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async findById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findById(id);
    }



    //Endpoint para actualizar la información de un empleado en concreto
    @Put("/update/:id")
    @ApiOperation({summary:"Actualizar una empleado determinado"})
    @ApiResponse({
        status: 200,
        description: 'Empleado actualizado con éxito',
        schema: {
          example: { message: 'Empleado actualizado con éxito' },
        },
      })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async updateStaff(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateStaffDto) {
        return this.staffService.updateStaff(id, updateDto); //Se parsea a string el id por si viene en number
    }




    //Endpoint para eliminar un empleado
    @Delete("/delete/:id")
    @ApiOperation({summary:"Borrar un empleado determinado"})
    @ApiResponse({ status: 201, description: 'Empleado eliminado con éxito',
        schema: {
          example: { message: 'Empleado actualizado con éxito' },
        },})
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async deleteStaff(@Param('id', ParseIntPipe) id: number) {
        return this.staffService.deleteStaff(id); // conviertes el string a número
    }
}