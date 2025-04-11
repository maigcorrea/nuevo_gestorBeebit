import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { CrearTareaDto } from 'src/EjemploArquitectura/infrastructure/dto/crear-tarea.dto';
import { CrearTareaUseCase } from 'src/EjemploArquitectura/appplication/use-cases/crear-tarea.use-case';
import { ListarTareasUseCase } from 'src/EjemploArquitectura/appplication/use-cases/listar-tareas.use-case';
import { CompletarTareaUseCase } from 'src/EjemploArquitectura/appplication/use-cases/completar-tarea.use-case';
import { TareaRepository } from '../persistence/tarea.repository';

@Controller('tareas')
export class TaskController {
  constructor(private readonly tareaRepo: TareaRepository) {
    this.crearTarea = new CrearTareaUseCase(tareaRepo);
    this.listarTareas = new ListarTareasUseCase(tareaRepo);
    this.completarTarea = new CompletarTareaUseCase(tareaRepo);
  }


  private readonly crearTarea: CrearTareaUseCase;
  private readonly listarTareas: ListarTareasUseCase;
  private readonly completarTarea: CompletarTareaUseCase;


  @Post()
  async crear(@Body() dto: CrearTareaDto) {
    return this.crearTarea.ejecutar(dto);//Ejecutar de crearTareaUseCase
  }

  @Get()
  async listar() {
    return this.listarTareas.ejecutar(); //Ejecutar de listarUseCase
  }

  @Put(':id/completar')
  async completar(@Param('id') id: string) {// Ejecutar de completarTareaUseCase
    return this.completarTarea.ejecutar(id);
  }
}
