import { SaveProfileImageUseCase } from '../save-profile-image.use-case';
import { StaffRepositoryPort } from '../../../domain/interfaces/staff-repository.port';
import { Staff } from '../../../domain/entities/staff.entity';

describe('SaveProfileImageUseCase', () => {
  let useCase: SaveProfileImageUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  const mockStaff: Staff = new Staff(
    '123e4567-e89b-12d3-a456-426614174000',
    'Juan',
    'juan@gmail.com',
    '682543621',
    'hashed-password',
    new Date(),
    'user',
    null,
    null,
    null
  );

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      // Otros métodos del repositorio no usados pueden omitirse o dejar como jest.fn()
    } as any;

    useCase = new SaveProfileImageUseCase(mockRepo);
  });

  it('debería guardar la URL de la imagen en el usuario', async () => {
    mockRepo.findById.mockResolvedValue(mockStaff);
    mockRepo.save.mockResolvedValue(undefined); // save() no tiene por qué devolver nada

    await useCase.execute({
      userId: mockStaff.id,
      imageUrl: 'http://localhost:9000/profile-pictures/test.png',
    });

    expect(mockRepo.findById).toHaveBeenCalledWith(mockStaff.id);
    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockStaff,
        profileImage: 'http://localhost:9000/profile-pictures/test.png',
      })
    );
  });

  it('debería lanzar error si el usuario no existe', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'no-existe',
        imageUrl: 'http://localhost:9000/test.png',
      })
    ).rejects.toThrow('Usuario no encontrado');
  });
});
