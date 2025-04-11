import { Tarea } from '../../domain/entities/tarea.entity';
import { TareaRepositoryPort } from '../../domain/ports/tarea.repository.port';

export class TareaRepository implements TareaRepositoryPort {
  private db: Tarea[] = []; // simulación de base de datos en memoria

  async guardar(tarea: Tarea): Promise<Tarea> {
    this.db.push(tarea);
    return tarea;
  }
}
