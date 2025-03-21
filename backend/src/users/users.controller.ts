// Importamos los decoradores de NestJS que nos permiten crear controladores y manejar rutas HTTP.
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
// Importamos los decoradores de Swagger para documentar el API.
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// Importamos el servicio UsersService que contiene la lógica de negocio.
import { UsersService } from './users.service';
// Importamos el DTO que vamos a recibir en la creación de usuarios.
import { CreateUserDto } from './dto/create-user.dto'; // El DTO que has creado
import { UserResponseDto } from './dto/user-response.dto'; // Importamos el DTO de respuesta
// Importamos la entidad User para que Swagger sepa qué tipo de datos devuelve cada endpoint.
import { User } from './entities/user.entity';
//Para transformar automáticamente los tipos de datos
import { ParseIntPipe } from '@nestjs/common';


import { NotFoundException } from '@nestjs/common';

// El decorador @ApiTags agrupa los endpoints en Swagger bajo la categoría "Users".
@ApiTags('Users') // Agrupa las rutas bajo la categoría "Users" en Swagger
@Controller('users') // Este decorador indica que todos los endpoints definidos en esta clase comenzarán con la ruta /users.
export class UsersController {
  // Constructor que inyecta el servicio de usuarios.
  constructor(private readonly usersService: UsersService) {}

  // Indica que este método manejará solicitudes POST en /users.
  @Post()
  // Describe brevemente qué hace este endpoint para Swagger.
  @ApiOperation({ summary: 'Crear usuario básico' })
  // Indica a Swagger que si todo sale bien, devolverá un usuario con status 201.
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente', type: UserResponseDto})
   // Indica a Swagger que podría haber un error si los datos son inválidos.
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createUserDto: CreateUserDto) {
    // Recibe el cuerpo de la petición (body) y lo convierte en un CreateUserDto automáticamente.
    // Llama al método create() del servicio, pasándole el DTO.
    return this.usersService.create(createUserDto);
  }

  // Este endpoint maneja POST en /users/custom.
  @Post('custom')
  @ApiOperation({summary:'Crear usuario personalizado'})
  @ApiResponse({ status:201, description: 'Usuario creado correctamente', type: UserResponseDto})
  @ApiResponse({status:400, description: 'Datos inválidos'})
  createUser(@Body() createUserDto: CreateUserDto) {
    // Recibe el body sin usar DTO, directamente como un objeto plano.
    const { name, email, password } = createUserDto;

    // Llama al método createUser() del servicio, pasándole los datos de forma individual.
    return this.usersService.createUser(name, email, password);
  }

  // Definir el endpoint para obtener todos los usuarios. Este endpoint maneja GET en /users/all.
  @Get('all')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Listado de usuarios', type: [UserResponseDto] })
  findAll() {
    // Llama al método findAll() del servicio, que devuelve un array de usuarios.
    return this.usersService.findAll();
  }


  // Este endpoint maneja GET en /users/id. El :id es un parámetro de ruta.
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) { // <--- Cambia el tipo a string
    const user = await this.usersService.findOne(id);
    if (!user) {
      //throw new Error('Usuario no encontrado');
      //Más elegante el notFoundException
      throw new NotFoundException('Usuario no encontrado');
    }

    // Convertimos el objeto User en un UserResponseDto sin la contraseña (Para que al devolver los datos, la contraseña no aparezca, por eso usamos el user-response.dto)
    const { password, ...userResponse } = user; // Desestructuramos y eliminamos la contraseña

    return userResponse; // Devolvemos el usuario sin la contraseña
  }

}

