import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStaff } from './entities/taskStaff.entity';
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { Repository } from 'typeorm';
import { TaskStaffResponseDto } from './dto/task-staff-response.dto';
import { TaskWithStaffResponseDto } from './dto/task-with-staff.response.dto';
import { CreateTaskStaffDto } from './dto/create-task-staff.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TaskStaffService {
  constructor(
    @InjectRepository(TaskStaff)
    private taskStaffRepo: Repository<TaskStaff>,
    @InjectRepository(Task)
    private taskRepo:Repository<Task>,
    @InjectRepository(Staff)
    private staffRepo:Repository<Staff>

  ) {}

  async create(dto: CreateTaskStaffDto): Promise<TaskStaff> {
    const task = await this.taskRepo.findOne({ where: { id: dto.id_task } }); //Buscas en la base de datos, en la entidad Task, la tarea cuyo id sea igual a dto.id_task. Usas el repositorio de Task (taskRepo) y el método findOne. Si no existe una tarea con ese ID, la variable task será undefined
    const staff = await this.staffRepo.findOne({ where: { id: dto.id_staff } }); //Igual que con task, aquí buscas el empleado dentro de la entidad Staff cuyo id coincida con dto.id_staff
  
    //Verificas si alguno de los dos (task o staff) no fue encontrado
    if (!task || !staff) {
      throw new NotFoundException('Task o empleado no encontrado');
    }
  
    //Usas el método create() del repositorio para crear un nuevo objeto TaskStaff. Le pasas los objetos task y staff que recuperaste antes
    const nuevaRelacion = this.taskStaffRepo.create({ task, staff });

    //El método save() devuelve el objeto insertado, incluyendo su id generado automáticamente.
    return await this.taskStaffRepo.save(nuevaRelacion);
  }



  //Buscas todas las filas de task_staff, y pides que también se carguen los datos de las relaciones: task (tarea) y staff (empleado)
  async findAll(): Promise<TaskStaffResponseDto[]> {
    const relaciones = await this.taskStaffRepo.find({
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
    const relaciones = await this.taskStaffRepo.find({
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