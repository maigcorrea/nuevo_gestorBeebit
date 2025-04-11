import { FindStaffByIdUseCase } from '../find-staff-by-id.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff } from '../../../domain/entities/staff.entity';
import { StaffType } from '../../../domain/entities/staff.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindStaffByIdUseCase', () => {
  let useCase: FindStaffByIdUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindStaffByIdUseCase(mockRepo);
  });

  it('debería devolver el empleado si existe', async () => {
    const fakeStaff = new Staff(
      'uuid-123',
      'Juan Pérez',
      'juan@example.com',
      '682543621',
      'hashed_pass',
      new Date(),
      StaffType.USER,
      null,
      null,
      null,
    );

    mockRepo.findById.mockResolvedValue(fakeStaff);

    const result = await useCase.execute('uuid-123');

    expect(result).toEqual(fakeStaff);
    expect(mockRepo.findById).toHaveBeenCalledWith('uuid-123');
  });

  it('debería lanzar NotFoundException si no existe', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-404')).rejects.toThrow(NotFoundException);
  });
});
