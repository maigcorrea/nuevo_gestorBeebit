import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { Project } from './entities/project.entity'; 
 import { CreateProjectDto } from './dto/create-project.dto';
 import { UpdateProjectDto } from './dto/update-project.dto';
 import { ProjectResponseDto } from './dto/project-response.dto';
 import { NotFoundException } from '@nestjs/common';
 import { BadRequestException } from '@nestjs/common';
 import { ProjectStatus } from './entities/project.entity';
 
 @Injectable()
 export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) {}
 
 
    //Método para crear un proyecto
    async create(createProjectDto: CreateProjectDto):Promise<Project>{
        //CONTROLAR QUE A LA HORA DE CREAR EL PROYECTO, LA FECHA DE INICIO SEA LA DE HOY
        const { start_date, ...projectData} = createProjectDto;
        const project= this.projectRepository.create({
            ...projectData,
            start_date: start_date ? new Date(start_date) : new Date(), //Si el DTO (createProjectDto) incluye start_date, lo convierte a Date y lo usa. Si no hay start_date, crea uno nuevo con new Date() (la fecha y hora actuales).
        });
 
        return this.projectRepository.save(project);
    }


    //Método para mostrar todos los proyectos
    async findAll():Promise<Project[]>{
        return this.projectRepository.find();
    }


    //Método para mostrar un proyecto o proyectos concretos por su título
    async findByTitle(letter:string):Promise<Project[]>{
        return this.projectRepository
        .createQueryBuilder('project')
        .where('LOWER(project.title) ILIKE LOWER(:title)', { title: `%${letter}%` }) //PARA QUE SEA CASE SENSITIVE
        .getMany();
    }


    //Método para mostrar los proyectos según su estado (ya finalizados PARA EL HISTORIAL SI SE IMPLEMENTA)
    async findByStatus(state:string):Promise<Project[]>{
        return this.projectRepository.find({
            where:{ status:state.trim() as ProjectStatus}
        })
    }

    
    //Método para mostrar los proyectos según la fecha de inicio (orden de fecha más reciente a fecha más antigua)
    async orderByStartDateDesc():Promise<Project[]>{
        return this.projectRepository.find({
            order: {
              start_date: 'DESC', // Más reciente a más antigua
            },
        });
    }


    //Método para mostrar los proyectos según la fecha de inicio (orden de fecha más antigua a fecha más reciente)
    async orderByStartDateAsc():Promise<Project[]>{
        return this.projectRepository.find({
            order: {
              start_date: 'ASC', // Más antigua a másreciente
            },
        });
    }



    //Método para mostrar los proyectos según la fecha límite de entrega(orden de fecha de más próxima a más lejana)
    async orderByDeadline(): Promise<Project[]> {
        return this.projectRepository.find({
          order: {
            deadline: 'ASC', // De la fecha más próxima a la más lejana
          },
        });
    }


    //Método para borrar un proyecto según su id. Si no quiero que me devuelva nada, en la promesa poner void
    async deleteProject(id: number): Promise<{message: string }> {
        const result = await this.projectRepository.delete(id);
      
        if (result.affected === 0) {
          throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
        }

        return { message: `Proyecto con id ${id} eliminado con éxito` };
    }



    //Método para actualizar un proyecto según su id, cambiándole el titulo, descripción, fecha de inicio, deadline y estado. Dejando la última actualización last_update tal cómo estaba
    async updateProject(id: number, updateDto: UpdateProjectDto): Promise<{message: string}>{ //Se le pasa un objeto por parámetro con  los posibles campos opcionales que puede actualizar
        const project = await this.projectRepository.findOneBy({ id });
      
        if (!project) {
          throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
        }
      
        //Al pasarle el objeto, De esta forma, desestructuramos solo una vez:
        const { title, description, start_date, deadline, status } = updateDto;

        if (!title && !description && !start_date && !deadline && !status) {
            throw new BadRequestException('Debes proporcionar al menos un campo para actualizar');
        }

        
        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (start_date !== undefined) project.start_date = new Date(start_date);
        if (deadline !== undefined) project.deadline = new Date(deadline);
        if (status !== undefined) project.status = status;

        await this.projectRepository.save(project);

        return { message: `Proyecto con id ${id} actualizado con éxito` };
      
        // last_update NO SE TOCA 🔒
    }
 }