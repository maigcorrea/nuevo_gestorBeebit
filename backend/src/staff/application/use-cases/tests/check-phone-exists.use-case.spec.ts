import { CheckPhoneExistsUseCase } from '../check-phone-exists.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';

describe('CheckPhoneExistsUseCase', () => {
  let useCase: CheckPhoneExistsUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  const fakeStaff = new Staff(
    'uuid-456',
    'Usuario Demo',
    'demo@mail.com',
    '600123456',
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
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new CheckPhoneExistsUseCase(mockRepo);
  });

  it('debería retornar true si el teléfono existe', async () => {
    mockRepo.findByPhone.mockResolvedValue(fakeStaff);

    const result = await useCase.execute('600123456');

    expect(result).toBe(true);
    expect(mockRepo.findByPhone).toHaveBeenCalledWith('600123456');
  });

  it('debería retornar false si el teléfono no existe', async () => {
    mockRepo.findByPhone.mockResolvedValue(null);

    const result = await useCase.execute('999999999');

    expect(result).toBe(false);
    expect(mockRepo.findByPhone).toHaveBeenCalledWith('999999999');
  });
});
