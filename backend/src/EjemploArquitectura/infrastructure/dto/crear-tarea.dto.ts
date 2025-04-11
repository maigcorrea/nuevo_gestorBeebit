import { IsString } from 'class-validator';
import { CrearTareaInterface } from 'src/EjemploArquitectura/domain/interfaces/create-tarea.interface';

export class CrearTareaDto implements CrearTareaInterface{
    @IsString()
    titulo: string;
  }