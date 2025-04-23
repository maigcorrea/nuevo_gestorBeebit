import { FindAllStaffUseCase } from '../find-all-staff.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';
import { ForbiddenException } from '@nestjs/common';

describe('FindAllStaffUseCase', () => {
  let useCase: FindAllStaffUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;
  let ability: any;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    ability = {
      can: jest.fn().mockReturnValue(true),
    };

    useCase = new FindAllStaffUseCase(mockRepo);
  });

  it('debería devolver todos los empleados si tiene permisos', async () => {
    const fakeList: Staff[] = [
      new Staff(
        'uuid-1',
        'Usuario 1',
        'u1@mail.com',
        '111111111',
        'pass1',
        new Date(),
        StaffType.USER,
        null,
        null,
        null
      ),
      new Staff(
        'uuid-2',
        'Usuario 2',
        'u2@mail.com',
        '222222222',
        'pass2',
        new Date(),
        StaffType.ADMIN,
        null,
        null,
        null
      ),
    ];

    mockRepo.findAll.mockResolvedValue(fakeList);

    const result = await useCase.execute(ability);

    expect(result).toEqual(fakeList);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('debería lanzar ForbiddenException si no tiene permisos', async () => {
    ability.can.mockReturnValue(false);

    await expect(useCase.execute(ability)).rejects.toThrow(ForbiddenException);
    expect(mockRepo.findAll).not.toHaveBeenCalled();
  });
});
