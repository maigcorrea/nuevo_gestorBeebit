import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
import { TaskStaffOrmEntity } from 'src/tasks_staff/infrastructure/persistence/task-staff.orm-entity';
import { faker } from '@faker-js/faker';
import { TaskTypeOrmEntity } from 'src/task/infrastructure/persistence/task.typeorm.entity';



export class TaskStaffSeeder implements Seeder {
    constructor(
      @InjectRepository(TaskStaffOrmEntity)
      private readonly taskStaffRepository: Repository<TaskStaffOrmEntity>,
      @InjectRepository(StaffOrmEntity)
      private readonly staffRepository: Repository<StaffOrmEntity>,
      @InjectRepository(TaskTypeOrmEntity)
      private readonly taskRepository: Repository<TaskTypeOrmEntity>,
    ) {}
  
    async seed(): Promise<any> {
      const taskStaffData: Partial<TaskStaffOrmEntity>[] = [];
  
      // Obtener algunas tareas y empleados aleatorios
      const tasks = await this.taskRepository.find();
      const staffs = await this.staffRepository.find();
  
      // Crear relaciones de asignación entre tareas y empleados
      for (let i = 0; i < 10; i++) {
        const task = faker.helpers.arrayElement(tasks);
        const staff = faker.helpers.arrayElement(staffs);
  
        taskStaffData.push({
          task,
          staff,
        });
      }
  
      await this.taskStaffRepository.insert(taskStaffData); // Insertar en la base de datos
    }
  
    async drop(): Promise<any> {
      await this.taskStaffRepository.clear();
    }
  }