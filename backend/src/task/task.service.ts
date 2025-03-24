import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity'; 
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TaskService{
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {}


    //Método para crear una tarea
    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const { start_date, ...restData } = createTaskDto;
      
        const task = this.taskRepository.create({
          ...restData,
          start_date: start_date ? new Date(start_date) : new Date(),
          end_date: null,         //Forzamos null al crear
          completed: false,       // Forzamos a false al crear
          status: 'pending',      // Forzamos a 'pending' por defecto
        });
      
        return this.taskRepository.save(task);
    }


    //Método para mostrar todas las tareas de un proyecto en concreto
    async findByProject(projectId:number):Promise<Task[]>{
        const tasks = await this.taskRepository.find({
            where:{ associated_project: { id: projectId }},
            relations: ['associated_project'], // opcional: para incluir los datos del proyecto si los necesitas. Esto hace que se cargue el proyecto junto con la tarea
        })

        if(tasks.length===0){
            throw new NotFoundException(`No se encontraron tareas para este proyecto`);
        }

        return tasks;
    }


    async updateTask(id: number, updateDto: UpdateTaskDto): Promise<{ message: string }> {
        const task = await this.taskRepository.findOneBy({ id });
      
        if (!task) {
          throw new NotFoundException(`No se encontró la tarea con id ${id}`);
        }
      
        //La fecha de inicio de la tarea no se puede modificar, es la fecha del momento de creación de la tarea
        const { title, description, status, priority } = updateDto;
      
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
      
        // 👇 Lógica para cuando se actualiza el estado
        if (status !== undefined) {
          task.status = status;
      
          if (status === 'completed') {
            task.completed = true;
            task.end_date = new Date(); // fecha actual como finalización
          }
        }
      
        await this.taskRepository.save(task);
      
        return { message: `Tarea con id ${id} actualizada con éxito` };
      }
}
