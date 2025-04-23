import { CheckEmailExistsUseCase } from '../check-email-exists.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';

describe('CheckEmailExistsUseCase', () => {
  let useCase: CheckEmailExistsUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  const fakeStaff = new Staff(
    'uuid-123',
    'Usuario Prueba',
    'prueba@mail.com',
    '682543621',
    'hashedPass',
    new Date(),
    StaffType.USER,
    null,
    null,
    null
  );

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new CheckEmailExistsUseCase(mockRepo);
  });

  it('debería retornar true si el email existe', async () => {
    mockRepo.findByEmail.mockResolvedValue(fakeStaff);

    const result = await useCase.execute('prueba@mail.com');

    expect(result).toBe(true);
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('prueba@mail.com');
  });

  it('debería retornar false si el email no existe', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute('inexistente@mail.com');

    expect(result).toBe(false);
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('inexistente@mail.com');
  });
});
