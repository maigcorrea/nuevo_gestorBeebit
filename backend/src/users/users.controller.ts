import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Usuarios') // Agrupa los endpoints en Swagger
@Controller('users')
export class UsersController {

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  findAll() {
    return [
      { id: 1, name: 'Usuario 1' },
      { id: 2, name: 'Usuario 2' },
    ];
  }
}
