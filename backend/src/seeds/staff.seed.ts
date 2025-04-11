import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff, StaffType } from 'src/staff2/domain/entities/staff.entity';
import { faker } from '@faker-js/faker';

export class StaffSeeder implements Seeder {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {console.log('✅ StaffSeeder inicializado');}

  async seed(): Promise<any> {
    const data: Partial<Staff>[] = [];

    for (let i = 0; i < 10; i++) {
      data.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: '123456', // Puedes reemplazar con hash si tienes un servicio de hash
        register_date: new Date(),
        type: faker.helpers.arrayElement([StaffType.ADMIN, StaffType.USER]),
        resetToken: null,
        resetTokenExpiry: null,
        profileImage: faker.image.avatar(),
      });
    }

    await this.staffRepository.insert(data);
  }

  async drop(): Promise<any> {
    await this.staffRepository.clear();
  }
}