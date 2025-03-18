import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity'; // Importamos la entidad User

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user); // Llamamos al servicio para crear un nuevo usuario
  }

  async createUser(@Body() body: { name: string; email: string; password: string }) {
    const { name, email, password } = body;
    return this.usersService.createUser(name, email, password);
  }

  // Definir el endpoint para obtener todos los usuarios
  @Get()
  findAll() {
    return this.usersService.findAll(); // Llamamos al servicio para obtener todos los usuarios
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id); // Llamamos al servicio para obtener un usuario por su ID
  }
}
