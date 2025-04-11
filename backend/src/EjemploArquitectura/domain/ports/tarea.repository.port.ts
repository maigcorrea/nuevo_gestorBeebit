import { Tarea } from '../entities/tarea.entity';

export interface TareaRepositoryPort {
  guardar(tarea: Tarea): Promise<Tarea>;
  buscarTodas(): Promise<Tarea[]>;
  buscarPorId(id: string): Promise<Tarea | null>;
  actualizar(tarea: Tarea): Promise<Tarea>;
}