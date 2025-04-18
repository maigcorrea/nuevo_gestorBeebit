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
 import { MinioService } from 'src/minio/minio.service';
 import { Task } from 'src/task/entities/task.entity';
 import { TaskStatus } from 'src/task/entities/task.entity';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException } from '@nestjs/common';
 
 @Injectable()
 export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private readonly minioService: MinioService
    ) {}
 
 
    //Método para crear un proyecto
    async create(createProjectDto: CreateProjectDto, ability:AppAbility, file?: Express.Multer.File):Promise<Project>{
        console.log('ability', ability);
        if (!ability.can('create', Project)) {
            throw new ForbiddenException('No tienes permiso para crear nuevos proyectoss');
        }
        //CONTROLAR QUE A LA HORA DE CREAR EL PROYECTO, LA FECHA DE INICIO SEA LA DE HOY
        const { start_date, deadline, ...projectData} = createProjectDto;

        //Para guardar la url del documento de minio
        let document_url: string | undefined = undefined;

        if (file) {
            const fileName = `projects/${Date.now()}-${file.originalname}`;
            const { url, filename } = await this.minioService.upload(file, fileName);
            document_url = url;

            // Puedes guardar también el filename si quieres añadir otra columna después (De momento no se implementa, sólo se muestra el nombre por consola)
            console.log('Documento subido:', filename);
        }

        const project= this.projectRepository.create({
            ...projectData,
            start_date: start_date ? new Date(start_date) : new Date(), //Si el DTO (createProjectDto) incluye start_date, lo convierte a Date y lo usa. Si no hay start_date, crea uno nuevo con new Date() (la fecha y hora actuales).
            deadline: deadline ? new Date(deadline) : null,
            document_url,
        });
 
        return this.projectRepository.save(project);
    }


    //Método para mostrar todos los proyectos
    async findAll(ability:AppAbility):Promise<ProjectResponseDto[]>{
        if (!ability.can('read', Project)) {
            throw new ForbiddenException('No tienes permiso para ver los proyectos');
        }

        const projects = await this.projectRepository.find();

        return projects.map((project:any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            start_date: project.start_date,
            deadline: project.deadline,
            last_update: project.last_update,
            status: project.status,
            document_url: project.document_url,
        }));
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
    async deleteProject(id: string, ability:AppAbility): Promise<{message: string }> {
        const project = await this.projectRepository.findOneBy({ id });
        
      
        if (!project) {
          throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
        }

        if (!ability.can('delete', project)) {
            throw new ForbiddenException('No tienes permiso para eliminar este proyecto');
        }

        const result = await this.projectRepository.delete(id);
      
        if (result.affected === 0) {
          throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
        }

        return { message: `Proyecto con id ${id} eliminado con éxito` };
    }



    //Método para actualizar un proyecto según su id, cambiándole el titulo, descripción, fecha de inicio, deadline y estado. Dejando la última actualización last_update tal cómo estaba
    async updateProject(id: string, updateDto: UpdateProjectDto, ability: AppAbility): Promise<{message: string}>{ //Se le pasa un objeto por parámetro con  los posibles campos opcionales que puede actualizar
        const project = await this.projectRepository.findOneBy({ id });
        
      
        if (!project) {
          throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
        }

        if (!ability.can('update', project)) {
            throw new ForbiddenException('No tienes permiso para modificar este proyecto');
        }
      
        //Al pasarle el objeto, De esta forma, desestructuramos solo una vez:
        const { title, description, start_date, deadline, status } = updateDto;

        if (!title && !description && !start_date && !deadline && !status) {
            throw new BadRequestException('Debes proporcionar al menos un campo para actualizar');
        }

        const hoy = new Date();
        const haceUnaSemana = new Date();
        haceUnaSemana.setDate(hoy.getDate() - 7);

        if (start_date !== undefined) {
        const nuevaInicio = new Date(start_date);
        
        project.start_date = nuevaInicio;
        }

        if (deadline !== undefined) {
        const nuevaDeadline = new Date(deadline);
        if (start_date !== undefined && nuevaDeadline < new Date(start_date)) {
            throw new BadRequestException('La fecha de entrega no puede ser anterior a la fecha de inicio');
        }
        if  (start_date === undefined && project.start_date && nuevaDeadline < project.start_date) {
            throw new BadRequestException('La fecha de entrega no puede ser anterior a la fecha de inicio actual del proyecto');
        }
        project.deadline = nuevaDeadline;
        }

        
        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (start_date !== undefined) project.start_date = new Date(start_date);
        if (deadline !== undefined) project.deadline = new Date(deadline);
        if (status !== undefined) project.status = status;

        await this.projectRepository.save(project);

        // Marcar todas las tareas como completadas si se cambia a 'completed'
        if (status === ProjectStatus.COMPLETED) {
            await this.taskRepository.update(
            { associated_project: { id: project.id } },
            {
                status: TaskStatus.COMPLETED,
                completed: true,
                end_date: new Date(),
            }
            );
        }

        return { message: `Proyecto con id ${id} actualizado con éxito` };
      
        // last_update NO SE TOCA 🔒
    }


    //Comprobar si un título ya existe a la hora de crear un proyecto
    async titleExists(title: string): Promise<{ exists: boolean }> {
        const exists = await this.projectRepository.exist({ where: { title } });
        return { exists };
    }
 }