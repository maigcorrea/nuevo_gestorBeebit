import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { FindAllStaffUseCase } from 'src/staff2/application/use-cases/find-all-staff.use-case';
import { Staff } from '../../domain/entities/staff.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

describe('StaffController - getAllEmails', () => {
  let controller: StaffController;
  let findAllStaffUseCase: FindAllStaffUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: FindAllStaffUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CaslAbilityFactory,
          useValue: {
            createForUser: jest.fn(() => ({})), // simulamos la habilidad
          },
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    findAllStaffUseCase = module.get<FindAllStaffUseCase>(FindAllStaffUseCase);
  });

  it('debería devolver solo los correos electrónicos de todos los usuarios', async () => {
    const mockUsers: Staff[] = [
      new Staff('1', 'Juan', 'juan@gmail.com', new Date(), '111111111', 'pass', 'user', null, null, null),
      new Staff('2', 'Ana', 'ana@gmail.com', new Date(), '222222222', 'pass', 'user', null, null, null),
    ];

    (findAllStaffUseCase.execute as jest.Mock).mockResolvedValue(mockUsers);

    const result = await controller.getAllEmails({ user: {} } as any);

    expect(result).toEqual(['juan@gmail.com', 'ana@gmail.com']);
    expect(findAllStaffUseCase.execute).toHaveBeenCalled();
  });
});
