import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';


@ApiTags('Projects')
@Controller("projects")

export class ProjectController{
    constructor(private readonly projectService: ProjectService) {}

    @Post()

    @ApiOperation({summary:"Crear proyecto"})
    @ApiResponse({ status: 201, description: 'Proyecto creado correctamente', type: ProjectResponseDto})
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createProjectDto: CreateProjectDto) {
        // Recibe el cuerpo de la petición (body) y lo convierte en un CreateUserDto automáticamente.
        // Llama al método create() del servicio, pasándole el DTO.
        try {
            return this.projectService.create(createProjectDto);       
        } catch (err) {
            console.error('❌ ERROR en el controlador:', err);
            throw err;
        }
    }

    //Comprobar que el id recibido es un UUID válido
    /*@Get(':id')
        findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.projectService.findById(id);
    }*/

    // Endpoint para obtener todos los proyectos. Este endpoint maneja GET en /projects/.
    @Get()

    @ApiOperation({summary:"Listar todos los proyectos"})
    @ApiResponse({ status: 200, description: 'Listado de proyectos', type: [ProjectResponseDto] })
    @ApiResponse({ status: 404, description: 'No se encontraron proyectos' })
    async findAll(): Promise<ProjectResponseDto[]> {
        const projects = await this.projectService.findAll();
      
        if (!projects.length) {
          throw new NotFoundException('No se encontraron proyectos');
        }
      
        return projects;
    }


    // Endpoint para obtener proyectos en función de si su título coincide con un parámetro tipo string
    @Get("filter/title/:title")
    @ApiOperation({summary:"Listar proyectos según su título"})
    @ApiResponse({status: 200, description: 'Listado de proyectos según título', type: [ProjectResponseDto]})
    @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
    async findByTitle(@Param('title') title: string): Promise<ProjectResponseDto[]> {
        const projects = await this.projectService.findByTitle(title);
        if (!projects.length) {
          throw new NotFoundException('No se encontraron proyectos con ese título');
        }

        return projects;
    }



    // Endpoint para obtener proyectos según su estado
    @Get("filter/state/:state")
    @ApiOperation({summary:"Listar proyectos según su estado"})
    @ApiResponse({status:200, description: "Listado de proyectos según estado", type: [ProjectResponseDto]})
    @ApiResponse({status:404, description: "No se encontraron proyectos"})
    async findByStatus(@Param('state') state: string): Promise<ProjectResponseDto[]>{
        const projects= await this.projectService.findByStatus(state);
        if (!projects.length) {
            throw new NotFoundException('No se encontraron proyectos con ese estado');
        }

        return projects;
    }


    //Endpoint para mostrar proyectos ordenados según la fecha de inicio (De más reciente a más antigua)
    @Get("sort/:dteDesc")
    @ApiOperation({summary:"Listar proyectos ordenados según la fecha de inicio (Más reciente a más antigua)"})
    @ApiResponse({status:200, description: "Listado de proyectos ordenados", type: [ProjectResponseDto]})
    @ApiResponse({status:404, description: "No se encontraron proyectos"})
    async orderByStartDateDesc(): Promise<ProjectResponseDto[]>{
        const projects= await this.projectService.orderByStartDateDesc();
        if(!projects.length) {
            throw new NotFoundException("No se encontraron proyectos");
        }

        return projects;
    }


    //Endpoint para mostrar proyectos ordenados según la fecha de inicio (De más reciente a más antigua)
    @Get("sort/:dteAsc")
    @ApiOperation({summary:"Listar proyectos ordenados según la fecha de inicio (Más antigua a más reciente)"})
    @ApiResponse({status:200, description: "Listado de proyectos ordenados", type: [ProjectResponseDto]})
    @ApiResponse({status:404, description: "No se encontraron proyectos"})
    async orderByStartDateAsc(): Promise<ProjectResponseDto[]>{
        const projects= await this.projectService.orderByStartDateAsc();
        if(!projects.length) {
            throw new NotFoundException("No se encontraron proyectos");
        }

        return projects;
    }



    //Endpoint para mostrar proyectos ordenados según la fecha de entrega(De más próxima a más lejana)
    @Get("sort/dteDeadline")
    @ApiOperation({summary:"Listar proyectos ordenados según la fecha de entrega (Más próxima a más lejana)"})
    @ApiResponse({status:200, description: "Listado de proyectos ordenados", type: [ProjectResponseDto]})
    @ApiResponse({status:404, description: "No se encontraron proyectos"})
    async orderByDeadline(): Promise<ProjectResponseDto[]>{
        const projects= await this.projectService.orderByDeadline();
        if(!projects.length) {
            throw new NotFoundException("No se encontraron proyectos");
        }

        return projects;
    }


    //Endpoint para borrar un proyecto según su id
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar proyecto por ID' })
    @ApiResponse({ status: 200, description: 'Proyecto eliminado' })
    @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
    async deleteProject(@Param('id', ParseIntPipe) id: string) {
        return this.projectService.deleteProject(id); // conviertes el string a número
    }



    //Endpoint para actualizar la información de un proyecto según su id
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar proyecto' })
    @ApiResponse({ status: 200, description: 'Proyecto actualizado con éxito' })
    @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
    async updateProject(@Param('id', ParseIntPipe) id: string, @Body() updateDto: UpdateProjectDto) {
        return this.projectService.updateProject(id, updateDto); //Se parsea a string el id por ni viene en number
    }
}