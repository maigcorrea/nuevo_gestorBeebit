import { UpdateStaffUseCase } from '../update-staff.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UpdateStaffUseCase', () => {
  let useCase: UpdateStaffUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;
  let mockAbility: any;

  const existingStaff = new Staff(
    'uuid-123',
    'Juan Pérez',
    'juan@example.com',
    '682543621',
    'oldHashedPassword',
    new Date(),
    StaffType.USER,
    null,
    null,
    null
  );

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    mockAbility = {
      can: jest.fn().mockReturnValue(true),
    };

    useCase = new UpdateStaffUseCase(mockRepo);
  });

  it('debería actualizar correctamente los campos modificables', async () => {
    mockRepo.findById.mockResolvedValue(existingStaff);
    mockRepo.save.mockResolvedValue(existingStaff);

    const input = {
      email: 'nuevo@example.com',
      phone: '123456789',
      password: 'NuevaPass_1',
      type: StaffType.ADMIN,
    };

    const result = await useCase.execute('uuid-123', input, mockAbility);

    expect(mockRepo.findById).toHaveBeenCalledWith('uuid-123');
    expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      email: input.email,
      phone: input.phone,
      type: input.type,
    }));
    expect(result).toEqual({ message: `Empleado con id uuid-123 actualizado con éxito` });
  });

  it('debería lanzar NotFoundException si no existe el empleado', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('uuid-404', {}, mockAbility)
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    mockRepo.findById.mockResolvedValue(existingStaff);
    mockAbility.can.mockReturnValue(false);

    await expect(
      useCase.execute('uuid-123', { email: 'nuevo@mail.com' }, mockAbility)
    ).rejects.toThrow(ForbiddenException);
  });

  it('debería lanzar BadRequestException si no se proporciona ningún campo', async () => {
    mockRepo.findById.mockResolvedValue(existingStaff);

    await expect(
      useCase.execute('uuid-123', {}, mockAbility)
    ).rejects.toThrow(BadRequestException);
  });
});
