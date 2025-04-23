import { ChangePasswordUseCase } from '../change-password.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('ChangePasswordUseCase', () => {
  let useCase: ChangePasswordUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;
  let ability: { can: jest.Mock };

  const userId = 'uuid-abc';
  const oldPassword = 'OldPassword_1';
  const newPassword = 'NewPassword_2';

  const mockStaff = new Staff(
    userId,
    'Juan',
    'juan@mail.com',
    '682543621',
    '',
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
      findByIdWithPassword: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    ability = {
      can: jest.fn().mockReturnValue(true),
    };

    useCase = new ChangePasswordUseCase(mockRepo);
  });

  it('debería cambiar la contraseña correctamente', async () => {
    mockRepo.findById.mockResolvedValue({ ...mockStaff });
    mockRepo.save.mockResolvedValue({ ...mockStaff });

    const result = await useCase.execute({ userId, newPassword }, ability as any);

    expect(result).toBe(true);
    expect(mockRepo.findById).toHaveBeenCalledWith(userId);
    expect(mockRepo.save).toHaveBeenCalled();
    const hashed = mockRepo.save.mock.calls[0][0].password;
    expect(await bcrypt.compare(newPassword, hashed)).toBe(true);
  });

  it('debería lanzar NotFoundException si el usuario no existe', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ userId, newPassword }, ability as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    ability.can.mockReturnValue(false);

    await expect(
      useCase.execute({ userId, newPassword }, ability as any),
    ).rejects.toThrow(ForbiddenException);
  });
});
