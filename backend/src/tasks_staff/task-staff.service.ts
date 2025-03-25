import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStaff } from './entities/taskStaff.entity';
import { Repository } from 'typeorm';
import { TaskStaffResponseDto } from './dto/task-staff-response.dto';
import { TaskWithStaffResponseDto } from './dto/task-with-staff.response.dto';

@Injectable()
export class TaskStaffService {
  constructor(
    @InjectRepository(TaskStaff)
    private tareaStaffRepo: Repository<TaskStaff>,
  ) {}


  //Buscas todas las filas de task_staff, y pides que también se carguen los datos de las relaciones: task (tarea) y staff (empleado)
  async findAll(): Promise<TaskStaffResponseDto[]> {
    const relaciones = await this.tareaStaffRepo.find({
      relations: ['task', 'staff'],
    });

    //Mapear cada fila para construir un objeto con el título de la tarea y el nombre del empleado (por individual, tarea1- nombre1, tarea1-nombre2)
    return relaciones.map(rel => ({
      taskTitle: rel.task.title,
      staffFullName: `${rel.staff.name}`,
    }));
  }



  //Agrupar resultados de varios empleados para una tarea. Igual que antes, trae todas las relaciones con la info de tareas y empleados.
  async findGroupedByTask(): Promise<TaskWithStaffResponseDto[]> {
    const relaciones = await this.tareaStaffRepo.find({
      relations: ['task', 'staff'],
    });
  
    //Crear un Map para agrupar los nombres por cada taskTitle.
    const mapa = new Map<string, string[]>(); // título → array de empleados
  
    //Iteras sobre cada relación y extraes: taskTitle y fullName del empleado
    for (const rel of relaciones) {
      const taskTitle = rel.task.title;
      const fullName = `${rel.staff.name}`;
  
      //Si es la primera vez que ves esa tarea, la agregas al Map con un array. Si ya existe, simplemente haces push() del nuevo nombre.
      if (!mapa.has(taskTitle)) {
        mapa.set(taskTitle, [fullName]);
      } else {
        // Aquí TS no sabe si es undefined
        mapa.get(taskTitle)!.push(fullName);// <- el "!" le dice a TS "confía, no es undefined"
      }
    }
  
    // Finalmente, transformas el Map a un array de objetos que cumplen el DTO TaskWithStaffResponseDto.
    // Convertir el Map a un array de DTOs
    const resultado: TaskWithStaffResponseDto[] = [];
  
    mapa.forEach((staff, taskTitle) => {
      resultado.push({ taskTitle, staff });
    });
  
    return resultado;
  }
}