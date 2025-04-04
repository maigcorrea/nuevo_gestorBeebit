import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { ProjectStatus } from 'src/project/entities/project.entity';
import { faker } from '@faker-js/faker';

export class ProjectSeeder implements Seeder {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async seed(): Promise<any> {
    const data: Partial<Project>[] = [];

    for (let i = 0; i < 10; i++) {
      const startDate = faker.date.past();
      const deadline = faker.date.future();
      data.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        start_date: startDate,
        deadline: deadline,
        last_update: new Date(),
        status: faker.helpers.arrayElement([
            ProjectStatus.PENDING,
            ProjectStatus.ACTIVE,
            ProjectStatus.COMPLETED,
        ]),
      });
    }

    await this.projectRepository.insert(data);
  }

  async drop(): Promise<any> {
    await this.projectRepository.clear();
  }
}
