import { DeleteStaffUseCase } from '../delete-staff.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('DeleteStaffUseCase', () => {
  let useCase: DeleteStaffUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;
  let mockAbility: any;

  const staffSample = new Staff(
    'abc-123',
    'Juan Pérez',
    'juan@mail.com',
    '682543621',
    'hashedPass',
    new Date(),
    StaffType.USER,
    null,
    null,
    null,
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

    useCase = new DeleteStaffUseCase(mockRepo);
  });

  it('debería eliminar un empleado correctamente', async () => {
    mockRepo.findById.mockResolvedValue(staffSample);
    mockRepo.delete.mockResolvedValue();

    const result = await useCase.execute('abc-123', mockAbility);

    expect(mockRepo.findById).toHaveBeenCalledWith('abc-123');
    expect(mockRepo.delete).toHaveBeenCalledWith('abc-123');
    expect(result).toEqual({
      message: `Empleado con id abc-123 eliminado con éxito`,
    });
  });

  it('debería lanzar NotFoundException si el empleado no existe', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('no-existe', mockAbility),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    mockRepo.findById.mockResolvedValue(staffSample);
    mockAbility.can.mockReturnValue(false);

    await expect(
      useCase.execute('abc-123', mockAbility),
    ).rejects.toThrow(ForbiddenException);
  });
});
