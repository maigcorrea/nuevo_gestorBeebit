import { Tarea } from '../../domain/entities/tarea.entity';
import { TareaRepositoryPort } from '../../domain/ports/tarea.repository.port';
import { CrearTareaDto } from '../dto/crear-tarea.dto';
import { randomUUID } from 'crypto';

export class CrearTareaUseCase {
  constructor(private readonly tareaRepo: TareaRepositoryPort) {}

  async ejecutar(dto: CrearTareaDto): Promise<Tarea> {
    const tarea = new Tarea(randomUUID(), dto.titulo);
    return this.tareaRepo.guardar(tarea);
  }
}
