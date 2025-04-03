import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity'; 
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { TaskPriority, TaskStatus } from './entities/task.entity';

@Injectable()
export class TaskService{
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {}


    //Método para crear una tarea
    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const { start_date, associated_project, ...restData } = createTaskDto;
      
        const task = this.taskRepository.create({
          ...restData,
          start_date: start_date ? new Date(start_date) : new Date(),
          end_date: null,         //Forzamos null al crear
          completed: false,       // Forzamos a false al crear
          status: TaskStatus.PENDING,      // Forzamos a 'pending' por defecto. Así se usa el enum
          associated_project: { id: associated_project } as any
        });
      
        return this.taskRepository.save(task);
    }


    //Método para mostrar todas las tareas
    async findAll():Promise<Task[]>{
      return this.taskRepository.find({
        relations: ['associated_project'],
    });
    }


    //Método para mostrar todas las tareas de un proyecto en concreto
    async findByProject(projectId:string):Promise<Task[]>{
        const tasks = await this.taskRepository.find({
            where:{ associated_project: { id: projectId }},
            //relations: ['associated_project'], // opcional: para incluir los datos del proyecto si los necesitas. Esto hace que se cargue el proyecto junto con la tarea
        })

        if(tasks.length===0){
            throw new NotFoundException(`No se encontraron tareas para este proyecto`);
        }

        return tasks;
    }


    //Método para actualizar una tarea en concreto
    async updateTask(id: string, updateDto: UpdateTaskDto): Promise<{ message: string }> {
        const task = await this.taskRepository.findOneBy({ id });
      
        if (!task) {
          throw new NotFoundException(`No se encontró la tarea con id ${id}`);
        }
      
        //La fecha de inicio de la tarea no se puede modificar, es la fecha del momento de creación de la tarea
        const { title, description, status, priority } = updateDto;
      
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority= priority;

        //if (!title && !description && !priority && !status) {
          //throw new BadRequestException('Debes proporcionar al menos un campo para actualizar.');
        //}
      
        // 👇 Lógica para cuando se actualiza el estado
        if (status !== undefined) {
          task.status = status;
      
          if (status === 'completed') {
            task.completed = true;
            task.end_date = new Date(); // fecha actual como finalización
          } else {
            task.completed = false;
            task.end_date = null;
          }
        }
      
        await this.taskRepository.save(task);
      
        return { message: `Tarea con id ${id} actualizada con éxito` };
      }



      //Método para actualizar SOLO EL ESTADO de una tarea en concreto
      async updateTaskStatus(id: string, dto: UpdateTaskStatusDto): Promise<{ message: string }> {
        const task = await this.taskRepository.findOneBy({ id });
      
        if (!task) {
          throw new NotFoundException(`Tarea con id ${id} no encontrada`);
        }
      
        task.status = dto.status;
      
        if (dto.status === 'completed') {
          task.completed = true;
          task.end_date = new Date(); // fecha de finalización
        } else {
          task.completed = false;
          task.end_date = null;
        }
      
        await this.taskRepository.save(task);
      
        return { message: `Estado de la tarea actualizado a ${dto.status}` };
      }
      


      //Método para borrar una tarea en concreto
      async deleteTask(id:string):Promise<{message:string}>{
        const result = await this.taskRepository.delete(id);
      
        if (result.affected === 0) {
          throw new NotFoundException(`No se encontró la tarea con id ${id}`);
        }

        return { message: `Tarea con id ${id} eliminada con éxito` };
      }


      //Método para editar y actualizar el estado y prioridad de una tarea en concreto
      async updateStatusAndPriority(id: string, status: TaskStatus, priority: TaskPriority) {
        const task = await this.taskRepository.findOneBy({ id });
        if (!task) throw new NotFoundException('Tarea no encontrada');

        if (!Object.values(TaskStatus).includes(status)) {
          throw new BadRequestException('Estado no válido');
        }

        if (!Object.values(TaskPriority).includes(priority)) {
          throw new BadRequestException('Prioridad no válida');
        }

        task.status = status;
        task.priority = priority;
      
        return await this.taskRepository.save(task);
      }


}
