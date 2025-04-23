import { CreateStaffUseCase } from '../create-staff.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { StaffType, Staff } from '../../../domain/entities/staff.entity';
import { CreateStaffInput } from '../../../domain/interfaces/create-staff.input';
import * as bcrypt from 'bcryptjs';

describe('CreateStaffUseCase', () => {
  let useCase: CreateStaffUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  const mockAbility = {
    can: jest.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateStaffUseCase(mockRepo);
  });

  it('debería crear un nuevo usuario correctamente', async () => {
    const input: CreateStaffInput = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123456789',
      password: 'HolaMundo_2',
      type: StaffType.USER,
    };

    const expectedPassword = await bcrypt.hash(input.password, 10);

    // Mock de repo.save para que devuelva lo mismo que recibe
    mockRepo.save.mockImplementation(async (staff: Staff) => staff);

    const result = await useCase.execute(input, mockAbility as any);

    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.password).not.toBe(input.password); // ya debe estar hasheada
    expect(result.password).toEqual(expect.any(String));
    expect(result.register_date).toBeInstanceOf(Date);
    expect(result.id).toBeDefined();
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('debería lanzar error si no tiene permisos', async () => {
    mockAbility.can.mockReturnValue(false);

    const input: CreateStaffInput = {
      name: 'NoPerm',
      email: 'no@perm.com',
      phone: '000000000',
      password: 'Test1234_',
    };

    await expect(useCase.execute(input, mockAbility as any)).rejects.toThrow('No tienes permiso para crear nuevos empleados');
  });
});