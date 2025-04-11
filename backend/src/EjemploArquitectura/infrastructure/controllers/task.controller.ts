import { Controller, Post, Body } from '@nestjs/common';
import { CrearTareaDto } from 'src/EjemploArquitectura/appplication/dto/crear-tarea.dto';
import { CrearTareaUseCase } from 'src/EjemploArquitectura/appplication/use-cases/crear-tarea.use-case';
import { TareaRepository } from '../persistence/tarea.repository';

@Controller('tareas')
export class TaskController {
  private readonly crearTareaUseCase = new CrearTareaUseCase(new TareaRepository());

  @Post()
  async crear(@Body() dto: CrearTareaDto) {
    return this.crearTareaUseCase.ejecutar(dto);
  }
}
