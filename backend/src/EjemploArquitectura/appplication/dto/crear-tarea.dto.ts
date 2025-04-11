import { IsString } from 'class-validator';

export class CrearTareaDto {
    @IsString()
    titulo: string;
  }