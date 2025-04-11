import { TareaRepositoryPort } from '../../domain/ports/tarea.repository.port';
import { Tarea } from '../../domain/entities/tarea.entity';

export class ListarTareasUseCase {
  constructor(private readonly tareaRepo: TareaRepositoryPort) {}

  async ejecutar(): Promise<Tarea[]> {
    return this.tareaRepo.buscarTodas();
  }
}
