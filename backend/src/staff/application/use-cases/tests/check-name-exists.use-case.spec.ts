import { CheckNameExistsUseCase } from '../check-name-exists.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';

describe('CheckNameExistsUseCase', () => {
  let useCase: CheckNameExistsUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  const fakeStaff = new Staff(
    'uuid-abc',
    'Juan',
    'juan@mail.com',
    '682543621',
    'hashedPassword',
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

    useCase = new CheckNameExistsUseCase(mockRepo);
  });

  it('debería retornar true si el nombre existe', async () => {
    mockRepo.findByName.mockResolvedValue(fakeStaff);

    const result = await useCase.execute('Juan');

    expect(result).toBe(true);
    expect(mockRepo.findByName).toHaveBeenCalledWith('Juan');
  });

  it('debería retornar false si el nombre no existe', async () => {
    mockRepo.findByName.mockResolvedValue(null);

    const result = await useCase.execute('Pedro');

    expect(result).toBe(false);
    expect(mockRepo.findByName).toHaveBeenCalledWith('Pedro');
  });
});
