import { Tarea } from '../../domain/entities/tarea.entity';
import { TareaRepositoryPort } from '../../domain/ports/tarea.repository.port';

export class TareaRepository implements TareaRepositoryPort {
  private db: Tarea[] = []; // simulación de base de datos en memoria

  async guardar(tarea: Tarea): Promise<Tarea> {
    this.db.push(tarea);
    return tarea;
  }

  async buscarTodas(): Promise<Tarea[]> {
    return this.db;
  }

  async buscarPorId(id: string): Promise<Tarea | null> {
    return this.db.find(t => t.id === id) || null;
  }

  async actualizar(tarea: Tarea): Promise<Tarea> {
    const index = this.db.findIndex(t => t.id === tarea.id);
    if (index !== -1) {
      this.db[index] = tarea;
    }
    return tarea;
  }
}
