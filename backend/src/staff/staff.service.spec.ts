import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffType } from './entities/staff.entity';

describe('StaffService', () => {
  let service: StaffService;
  let repo: Repository<Staff>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getRepositoryToken(Staff),
          useClass: Repository, // Se puede reemplazar luego por mocks
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    repo = module.get<Repository<Staff>>(getRepositoryToken(Staff));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });




  it('debería crear un nuevo usuario', async () => {
    const dto: CreateStaffDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123456789',
      password: 'HolaMundo_2',
      type: StaffType.USER,
    };
  
    const hashedPassword = await bcrypt.hash(dto.password, 10);
  
    const savedStaff = {
      id: 1,
      ...dto,
      password: hashedPassword,
      register_date: new Date(),
    };
  
    // Mock del método `save()` del repositorio
    jest.spyOn(repo, 'create').mockReturnValue(savedStaff as any);
    jest.spyOn(repo, 'save').mockResolvedValue(savedStaff as any);
  
    const result = await service.create(dto);
  
    expect(result).toEqual(savedStaff);
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ name: dto.name }));
    expect(repo.save).toHaveBeenCalled();
  });
});