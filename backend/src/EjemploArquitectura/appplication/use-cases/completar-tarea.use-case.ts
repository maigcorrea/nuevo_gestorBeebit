import { TareaRepositoryPort } from '../../domain/ports/tarea.repository.port';

export class CompletarTareaUseCase {
  constructor(private readonly tareaRepo: TareaRepositoryPort) {}

  async ejecutar(id: string): Promise<string> {
    const tarea = await this.tareaRepo.buscarPorId(id);
    if (!tarea) {
      throw new Error('Tarea no encontrada');
    }

    tarea.completar();
    await this.tareaRepo.actualizar(tarea);
    return 'Tarea completada';
  }
}
