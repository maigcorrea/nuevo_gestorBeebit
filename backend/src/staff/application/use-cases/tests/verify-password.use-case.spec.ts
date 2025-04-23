import { VerifyPasswordUseCase } from '../verify-password.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';
import * as bcrypt from 'bcryptjs';
import { VerifyPasswordInput } from '../../../domain/interfaces/verify-password.input';

describe('VerifyPasswordUseCase', () => {
  let useCase: VerifyPasswordUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  const plainPassword = 'HolaMundo_2';
  let hashedPassword: string;

  const input: VerifyPasswordInput = {
    userId: 'abc-123',
    password: plainPassword,
  };

  beforeEach(async () => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByIdWithPassword: jest.fn(),
      findByEmail: jest.fn(),
      findByName: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    hashedPassword = await bcrypt.hash(plainPassword, 10);

    useCase = new VerifyPasswordUseCase(mockRepo);
  });

  it('debería retornar true si la contraseña es correcta', async () => {
    const user = new Staff(
      input.userId,
      'Juan',
      'juan@mail.com',
      '682543621',
      hashedPassword,
      new Date(),
      StaffType.USER,
      null,
      null,
      null
    );

    mockRepo.findByIdWithPassword.mockResolvedValue(user);

    const result = await useCase.execute(input);
    expect(result).toBe(true);
  });

  it('debería retornar false si el usuario no existe', async () => {
    mockRepo.findByIdWithPassword.mockResolvedValue(null);

    const result = await useCase.execute(input);
    expect(result).toBe(false);
  });

  it('debería retornar false si la contraseña es incorrecta', async () => {
    const user = new Staff(
      input.userId,
      'Juan',
      'juan@mail.com',
      '682543621',
      await bcrypt.hash('OtraPassword123!', 10), // otra distinta
      new Date(),
      StaffType.USER,
      null,
      null,
      null
    );

    mockRepo.findByIdWithPassword.mockResolvedValue(user);

    const result = await useCase.execute(input);
    expect(result).toBe(false);
  });
});
