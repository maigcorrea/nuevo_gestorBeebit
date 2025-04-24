import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/task/domain/entities/task.entity';
import { TaskPriority } from 'src/task/domain/enums/task.enums';
import { TaskStatus } from 'src/task/domain/enums/task.enums';
import { Project } from 'src/project/domain/entities/project.entity';
import { faker } from '@faker-js/faker';

export class TaskSeeder implements Seeder {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async seed(): Promise<any> {
    const projects = await this.projectRepository.find();

    if (projects.length === 0) {
      console.warn('⚠️ No hay proyectos en la base de datos. Se omite la creación de tareas.');
      return;
    }

    const tasks: Partial<Task>[] = [];

    for (let i = 0; i < 20; i++) {
      const project = faker.helpers.arrayElement(projects);
      const startDate = faker.date.recent();
      const status = faker.helpers.arrayElement([
        TaskStatus.PENDING,
        TaskStatus.ACTIVE,
        TaskStatus.COMPLETED,
      ]);

      tasks.push({
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        associated_project: {
          id: project.id,
          last_update: project.last_update ?? new Date,
          status: project.status,
          deadline: project.deadline ?? undefined,
        },
        start_date: startDate,
        end_date: status === TaskStatus.COMPLETED ? faker.date.soon({ days: 5, refDate: startDate }) : null,
        completed: status === TaskStatus.COMPLETED,
        priority: faker.helpers.arrayElement([
          TaskPriority.HIGH,
          TaskPriority.MEDIUM,
          TaskPriority.LOW,
        ]),
        status,
      });
    }

    await this.taskRepository.insert(tasks);
  }

  async drop(): Promise<any> {
    await this.taskRepository.clear();
  }
}
