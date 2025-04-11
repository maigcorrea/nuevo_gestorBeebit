import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff2/domain/entities/staff.entity';
import { TaskStaff } from 'src/tasks_staff/entities/taskStaff.entity';
import { faker } from '@faker-js/faker';



export class TaskStaffSeeder implements Seeder {
    constructor(
      @InjectRepository(TaskStaff)
      private readonly taskStaffRepository: Repository<TaskStaff>,
      @InjectRepository(Staff)
      private readonly staffRepository: Repository<Staff>,
      @InjectRepository(Task)
      private readonly taskRepository: Repository<Task>,
    ) {}
  
    async seed(): Promise<any> {
      const taskStaffData: Partial<TaskStaff>[] = [];
  
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