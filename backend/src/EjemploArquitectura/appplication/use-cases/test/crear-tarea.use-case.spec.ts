import { CrearTareaUseCase } from '../crear-tarea.use-case';
import { TareaRepositoryPort } from '../../../domain/ports/tarea.repository.port';
import { Tarea } from '../../../domain/entities/tarea.entity';

describe('CrearTareaUseCase', () => {
  let useCase: CrearTareaUseCase;
  let mockRepo: jest.Mocked<TareaRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      guardar: jest.fn(async (tarea: Tarea) => tarea),
      buscarTodas: jest.fn(),
      buscarPorId: jest.fn(),
      actualizar: jest.fn(),
    };

    useCase = new CrearTareaUseCase(mockRepo);
  });

  it('debería crear una tarea correctamente con título y estado por defecto', async () => {
    const dto = { titulo: 'Aprender testing en hexagonal' };
    const tarea = await useCase.ejecutar(dto);

    expect(tarea.titulo).toBe(dto.titulo);
    expect(tarea.estado).toBe('pendiente');
    expect(tarea.id).toBeDefined();
    expect(mockRepo.guardar).toHaveBeenCalledWith(expect.any(Tarea));
  });
});
