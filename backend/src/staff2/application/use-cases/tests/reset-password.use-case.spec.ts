import { ResetPasswordUseCase } from './reset-password.use-case';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { ResetPasswordInput } from '../../domain/interfaces/reset-password.input';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Staff, StaffType } from '../../domain/entities/staff.entity';

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      findByToken: jest.fn(),
      save: jest.fn(),
      // otros métodos no necesarios para este test
    } as any;

    useCase = new ResetPasswordUseCase(mockRepo);
  });

  const abilityMock = {
    can: jest.fn(() => true),
  };

  const fakeUser: Staff = new Staff(
    'uuid-1234',
    'Juan Pérez',
    'juan@gmail.com',
    new Date(),
    '682543620',
    'hashed_old_password',
    StaffType.USER,
    'reset-token-abc',
    new Date(Date.now() + 60 * 60 * 1000), // +1 hora
    null
  );

  it('debería resetear la contraseña correctamente', async () => {
    const input: ResetPasswordInput = {
      token: 'reset-token-abc',
      newPassword: 'NuevaPass_1',
    };

    mockRepo.findByToken.mockResolvedValue(fakeUser);
    mockRepo.save.mockResolvedValue(fakeUser);
    const compareSpy = jest.spyOn(bcrypt, 'hash');

    const result = await useCase.execute(input, abilityMock);

    expect(mockRepo.findByToken).toHaveBeenCalledWith(input.token);
    expect(compareSpy).toHaveBeenCalledWith(input.newPassword, 10);
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Contraseña actualizada correctamente' });
  });

  it('debería lanzar error si no tiene permiso', async () => {
    abilityMock.can.mockReturnValue(false);

    await expect(useCase.execute({ token: 'abc', newPassword: '123' }, abilityMock)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('debería lanzar error si el token está expirado', async () => {
    const expiredUser = { ...fakeUser, resetTokenExpiry: new Date(Date.now() - 10000) }; // expirado

    mockRepo.findByToken.mockResolvedValue(expiredUser);

    await expect(useCase.execute({ token: 'abc', newPassword: '123' }, abilityMock)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería lanzar error si no existe el usuario', async () => {
    mockRepo.findByToken.mockResolvedValue(null);

    await expect(useCase.execute({ token: 'abc', newPassword: '123' }, abilityMock)).rejects.toThrow(
      BadRequestException,
    );
  });
});
