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
import { Project } from 'src/project/entities/project.entity';
import { ProjectStatus } from 'src/project/entities/project.entity';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class TaskService{
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) {}


    //Método para crear una tarea
    async create(createTaskDto: CreateTaskDto, ability:AppAbility): Promise<Task> {
      if (!ability.can('create', Task)) {
        throw new ForbiddenException('No tienes permiso para crear nuevas tareas');
      }

      if (createTaskDto.start_date) {
        const fechaInicio = new Date(createTaskDto.start_date);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // eliminar horas para comparación exacta
      
        if (fechaInicio < hoy) {
          throw new BadRequestException('La fecha de inicio no puede ser anterior a hoy');
        }
      }
      
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
    async findAll(ability:AppAbility):Promise<Task[]>{
      if (!ability.can('read', Task)) {
        throw new ForbiddenException('No tienes permiso para acceder a las tareas');
      }

      return this.taskRepository.find({
        relations: ['associated_project'],
    });
    }


    //Método para mostrar todas las tareas de un proyecto en concreto
    async findByProject(projectId:string, ability:AppAbility):Promise<Task[]>{
        const tasks = await this.taskRepository.find({
            where:{ associated_project: { id: projectId }},
            //relations: ['associated_project'], // opcional: para incluir los datos del proyecto si los necesitas. Esto hace que se cargue el proyecto junto con la tarea
        })

        if(tasks.length===0){
            throw new NotFoundException(`No se encontraron tareas para este proyecto`);
        }

        const allowedTasks = tasks.filter(task => ability.can('update', task));

        if (allowedTasks.length === 0) {
          throw new ForbiddenException('No tienes permiso para ver estas tareas');
        }
  
        return allowedTasks;
    }


    //Método para actualizar una tarea en concreto
    async updateTask(id: string, updateDto: UpdateTaskDto, ability:AppAbility): Promise<{ message: string }> {

        const task = await this.taskRepository.findOne({
          where: { id },
          relations: ['associated_project'], // 👈 necesario para acceder al proyecto
        });
      
        if (!task) {
          throw new NotFoundException(`No se encontró la tarea con id ${id}`);
        }

        if (!ability.can('update', task)) {
          throw new ForbiddenException('No tienes permiso para actualizar esta tarea');
        }
      
        //La fecha de inicio de la tarea no se puede modificar, es la fecha del momento de creación de la tarea
        const { title, description, status, priority } = updateDto;
      
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority= priority;

        //if (!title && !description && !priority && !status) {
          //throw new BadRequestException('Debes proporcionar al menos un campo para actualizar.');
        //}
      
        // Lógica para cuando se actualiza el estado
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

        // Lógica para actualizar el estado del proyecto si hace falta
        if (task.associated_project?.id) {
          task.associated_project.last_update = new Date();// Actualizar last_update del proyecto

          const allTasks = await this.taskRepository.find({
            where: { associated_project: { id: task.associated_project.id } },
          });

          const todasCompletadas = allTasks.every(t => t.status === 'completed');
          const nuevoEstado = todasCompletadas ? ProjectStatus.COMPLETED : ProjectStatus.ACTIVE;


          if (task.associated_project.status !== nuevoEstado) {
            task.associated_project.status = nuevoEstado;
            if (todasCompletadas) {
              task.associated_project.deadline = new Date();
            }
          }
          await this.projectRepository.save(task.associated_project);
        }
      
        return { message: `Tarea con id ${id} actualizada con éxito` };
      }



      //Método para actualizar SOLO EL ESTADO de una tarea en concreto
      async updateTaskStatus(id: string, dto: UpdateTaskStatusDto, ability:AppAbility): Promise<{ message: string }> {
        console.log('Entro al método updateTaskStatus');
        const task = await this.taskRepository.findOne({
          where: { id },
          relations: ['associated_project'],
        });
      
        if (!task) {
          throw new NotFoundException(`Tarea con id ${id} no encontrada`);
        }

        if (!ability.can('update', task)) {
          throw new ForbiddenException('No tienes permiso para actualizar el estado de esta tarea');
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

         // Ahora revisamos TODAS las tareas de ese proyecto
        const allProjectTasks = await this.taskRepository.find({
          where: { associated_project: { id: task.associated_project.id } },
        });
        console.log('EStado de las Tareas del proyecto:', allProjectTasks.map(t => t.status));

        const todasCompletadas = allProjectTasks.every(t => t.status === 'completed');
        const nuevoEstadoProyecto = todasCompletadas ? ProjectStatus.COMPLETED : ProjectStatus.ACTIVE;;

        console.log('Nuevo estado del proyecto:', nuevoEstadoProyecto);

         // Actualizamos estado y fecha de última actualización
        const project = task.associated_project;
        project.last_update = new Date();

        if (project.status !== nuevoEstadoProyecto) {
          project.status = nuevoEstadoProyecto;
          if (todasCompletadas) {
            project.deadline = new Date();
          }
        }

        await this.projectRepository.save(project);

        // Solo actualiza si el estado cambia
        /*if (task.associated_project.status !== nuevoEstadoProyecto) {
          await this.projectRepository.update(task.associated_project.id, {
            status: nuevoEstadoProyecto,
            ...(todasCompletadas && { deadline: new Date() })
          });
        }*/
      
        return { message: `Estado de la tarea actualizado a ${dto.status}` };
      }
      


      //Método para borrar una tarea en concreto
      async deleteTask(id:string, ability:AppAbility):Promise<{message:string}>{
        const task = await this.taskRepository.findOne({
          where: { id },
          relations: ['associated_project'],
        });
      
        if (!task) {
          throw new NotFoundException(`Tarea con id ${id} no encontrada`);
        }

        if (!ability.can('delete', task)) {
          throw new ForbiddenException('No tienes permiso para borrar esta tarea');
        }

        const result = await this.taskRepository.delete(id);
      
        if (result.affected === 0) {
          throw new NotFoundException(`No se encontró la tarea con id ${id}`);
        }

        return { message: `Tarea con id ${id} eliminada con éxito` };
      }


      //Método para editar y actualizar el estado y prioridad de una tarea en concreto
      async updateStatusAndPriority(id: string, status: TaskStatus, priority: TaskPriority, ability:AppAbility) {
        const task = await this.taskRepository
  .createQueryBuilder('task')
  .leftJoinAndSelect('task.associated_project', 'project')
  .where('task.id = :id', { id })
  .getOne();

        if (!task) throw new NotFoundException('Tarea no encontrada');

        if (!ability.can('update', task)) {
          throw new ForbiddenException('No tienes permiso para modificar el estado y prioridad de esta tarea');
        }

        if (!Object.values(TaskStatus).includes(status)) {
          throw new BadRequestException('Estado no válido');
        }

        if (!Object.values(TaskPriority).includes(priority)) {
          throw new BadRequestException('Prioridad no válida');
        }

        task.status = status;
        task.priority = priority;

        // Marcar como completada si corresponde
        if (status === 'completed') {
          task.completed = true;
          task.end_date = new Date();
        } else {
          task.completed = false;
          task.end_date = null;
        }

        await this.taskRepository.save(task);

        // 👉 MISMA LÓGICA QUE EN updateTaskStatus
        const allProjectTasks = await this.taskRepository.find({
          where: { associated_project: { id: task.associated_project.id } },
        });

        const todasCompletadas = allProjectTasks.every(t => t.status === 'completed');
        const nuevoEstadoProyecto = todasCompletadas  ? ProjectStatus.COMPLETED : ProjectStatus.ACTIVE;

        const project = task.associated_project;
        project.last_update = new Date();

        console.log('Estado actual del proyecto:', task.associated_project.status);

        if (project.status !== nuevoEstadoProyecto) {
          project.status = nuevoEstadoProyecto;
          if (todasCompletadas) {
            project.deadline = new Date();
          }
        }
        
        console.log('Nuevo estado calculado:', nuevoEstadoProyecto);
      
        await this.projectRepository.save(project); 
        
        return task;

        
      }


}
