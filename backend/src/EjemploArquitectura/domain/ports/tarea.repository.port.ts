import { Tarea } from '../entities/tarea.entity';

export interface TareaRepositoryPort {
  guardar(tarea: Tarea): Promise<Tarea>;
}