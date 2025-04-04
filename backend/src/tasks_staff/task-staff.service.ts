import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStaff } from './entities/taskStaff.entity';
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { Repository } from 'typeorm';
import { TaskStaffResponseDto } from './dto/task-staff-response.dto';
import { TaskWithStaffResponseDto } from './dto/task-with-staff.response.dto';
import { CreateTaskStaffDto } from './dto/create-task-staff.dto';
import { UpdateTaskStaffDto } from './dto/update-task-staff.dto';
import { DeleteTaskStaffDto } from './dto/delete-task-staff.dto';
import { TaskByUserResponseDto } from './dto/task-by-user-response.dto';
import { ProjectByUserResponseDto } from './dto/project-by-user-response.dto';
import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';

@Injectable()
export class TaskStaffService {
  constructor(
    @InjectRepository(TaskStaff)
    private taskStaffRepo: Repository<TaskStaff>,
    @InjectRepository(Task)
    private taskRepo:Repository<Task>,
    @InjectRepository(Staff)
    private staffRepo:Repository<Staff>,
    private readonly mailQueueService: MailQueueService,

  ) {}

  async create(dto: CreateTaskStaffDto): Promise<TaskStaff[]> {
    const task = await this.taskRepo.findOne({ where: { id: dto.id_task } });

    //Verificas si alguno de los dos (task o staff) no fue encontrado
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    const relaciones: TaskStaff[] = [];

    for (const staffId of dto.id_staff) {
      const staff = await this.staffRepo.findOne({ where: { id: staffId } });

      //Verificas si alguno de los dos (task o staff) no fue encontrado
      if (!staff) {
        throw new NotFoundException(`Empleado con ID ${staffId} no encontrado`);
      }

      // Validar si ya existe la relación. Busca si ya hay una fila con esa combinación.
      const yaExiste = await this.taskStaffRepo.findOne({
        where: {
          task: { id: dto.id_task },
          staff: { id: staffId },
        },
      });

      if (yaExiste) {
        throw new ConflictException(`La relación con el empleado ${staffId} ya existe`);
      }


      // Si ya tiene 3 o más → lanza ConflictException
      const relacionesActuales = await this.taskStaffRepo.find({ //Obtiene todas las relaciones task_staff de un empleado concreto (staff.id)
        where: { staff: { id: staffId } },
        relations: ['task'], //Carga también la relación con la tarea (relations: ['task'])
      });


      const tareasActivas = relacionesActuales.filter(rel => rel.task.status === 'active');
      if (tareasActivas.length >= 3) {
        throw new ConflictException(`El empleado ${staffId} ya tiene 3 tareas activas`);
      }

      //Si todo está bien, se crea la nueva relación
      //Usas el método create() del repositorio para crear un nuevo objeto TaskStaff. Le pasas los objetos task y staff que recuperaste antes
      const nuevaRelacion = this.taskStaffRepo.create({ task, staff });

      //El método save() devuelve el objeto insertado, incluyendo su id generado automáticamente.
      const saved = await this.taskStaffRepo.save(nuevaRelacion);
      relaciones.push(saved);

      // 📨 Enviar correo de notificación al empleado
      await this.mailQueueService.sendMail({
        to: staff.email,
        subject: `Nueva tarea asignada: ${task.title}`,
        text: `Hola ${staff.name}, se te ha asignado una nueva tarea: ${task.title}\n\nDescripción: ${task.description}`,
      });
      
    }

    return relaciones;
  }



  //Buscas todas las filas de task_staff, y pides que también se carguen los datos de las relaciones: task (tarea) y staff (empleado)
  async findAll(): Promise<TaskStaffResponseDto[]> {
    const relaciones = await this.taskStaffRepo.find({
      relations: ['task', 'staff'],
    });

    //Mapear cada fila para construir un objeto con el título de la tarea y el nombre del empleado (por individual, tarea1- nombre1, tarea1-nombre2)
    return relaciones.filter((rel:any) => rel.task && rel.staff).map((rel:any) => ({
      taskId: rel.task.id,
      taskTitle: rel.task.title,
      staffFullName: `${rel.staff.id, rel.staff.name}`,
    }));
  }



  //Agrupar resultados de varios empleados para una tarea. Igual que antes, trae todas las relaciones con la info de tareas y empleados.
  async findGroupedByTask(): Promise<TaskWithStaffResponseDto[]> {
    const relaciones = await this.taskStaffRepo.find({
      relations: ['task', 'staff'],
    });
  
    //Crear un Map para agrupar los nombres por cada taskTitle.
    const mapa = new Map<string, { taskTitle: string, staff: { id: string, name: string }[] }>(); // título → array de empleados
  
    //Iteras sobre cada relación y extraes: taskTitle y staffName del empleado
    for (const rel of relaciones) {
      if (!rel.task || !rel.staff) {
        console.warn('⚠️ Relación inválida encontrada:', rel);
        continue; // salta al siguiente
      }
      const taskId = rel.task.id;
      const taskTitle = rel.task.title;
      const staffId = rel.staff.id;
      const staffName = `${rel.staff.name}`;

      const fullStaff = { id: staffId, name: staffName };
  
      //Si es la primera vez que ves esa tarea, la agregas al Map con un array. Si ya existe, simplemente haces push() del nuevo nombre.
      if (!mapa.has(taskId)) {
        mapa.set(taskId, { taskTitle, staff: [fullStaff] });
      } else {
        // Aquí TS no sabe si es undefined
        mapa.get(taskId)!.staff.push(fullStaff);// <- el "!" le dice a TS "confía, no es undefined"
      }
    }
  
    // Finalmente, transformas el Map a un array de objetos que cumplen el DTO TaskWithStaffResponseDto.
    // Convertir el Map a un array de DTOs
    const resultado: TaskWithStaffResponseDto[] = [];
  
    mapa.forEach((data, taskId) => {
      resultado.push({
        taskId,
        taskTitle: data.taskTitle,
        staff: data.staff,
      });
    });
  
    return resultado;
  }


  //Obtener las tareas de un usuario determinado
  async getTasksByUser(id:string): Promise <TaskByUserResponseDto[]>{
    console.log("Buscando tareas para ID:", id);
    try {
    const tasks = await this.taskStaffRepo.find({ 
      where: {
        staff:{id} // Busca relaciones donde el staff tenga ese ID
      },
      relations:['task', 'task.associated_project'] // Incluye los datos de la tarea relacionada y del proyecto asociado a esa tarea
     });

     console.log("Tareas encontradas:", tasks);

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`No se encontraron tareas para el empleado con id ${id}`);
    }
    
    const tareasFiltradas = tasks.filter((rel:any) => rel.task && rel.task.associated_project);

    return tareasFiltradas.map((rel:any) => ({
      id: rel.task.id ?? null,
      title: rel.task.title ?? null,
      description: rel.task.description ?? null,
      start_date: rel.task.start_date ?? null,
      end_date: rel.task.end_date ?? null,
      status: rel.task.status ?? null,
      completed: rel.task.completed ?? null,
      priority: rel.task.priority ?? null,
      associated_project: {
          id: rel.task.associated_project.id ?? null,
          name: rel.task.associated_project.title ?? null,
      }
    }));

  } catch (err) {
    console.error("Error interno en getTasksByUser:", err);
    throw new InternalServerErrorException("Error al obtener tareas");
  }
    
  }


  //Obtener los proyectos de un usuario determinado
  async getProjectsByUser(id:string): Promise<ProjectByUserResponseDto[]>{

    //Busca en la tabla intermedia task_staff todas las asignaciones donde el staff.id coincida con el que pasamos.
    const tasks= await this.taskStaffRepo.find({
      where: {staff:{id}},
      relations: ['task', 'task.associated_project'], //Le dice a TypeORM que incluya también los datos completos de: las task asociada a cada asignación, el proyecto asociado de cada tarea
    })

    if(!tasks || tasks.length === 0){
      throw new NotFoundException(`No se encontraron tareas`)
    }

    //Map para evitar proyectos duplicados, la clave es el id del proyecto y el valor el dto que vamos a devolver. Así, si una tarea y otra comparten el mismo proyecto, no lo añadimos dos veces
    const projectsMap= new Map<string, ProjectByUserResponseDto>();

    
    //Iteramos sobre cada relación tarea-empleado (cada fila de task_staff)
    for(const rel of tasks){
      //Desde la fila rel.task.associated_project, accedemos directamente al proyecto relacionado gracias a las relations que incluimos en el find()
      const project=rel.task.associated_project;


    if (!project) {
      console.warn(`⚠️ La tarea ${rel.task?.id} no tiene proyecto asociado.`);
      continue;
    }

      //Verificamos si ese proyecto ya está añadido al Map. Si no lo está, lo agregamos. Si ya está, no se vuelve a añadir
      if(!projectsMap.has(project.id)){
        //Agrega el proyecto al Map con su ID como clave y con todos los campos definidos en el DTO.
        projectsMap.set(project.id,{
          id: project.id,
          title: project.title,
          description: project.description,
          start_date: project.start_date,
          deadline: project.deadline,
          last_update: project.last_update,
          status:project.status,
        });
      }
    }

    //Convierte el Map en un array que contiene solo los valores (los proyectos únicos), y lo devuelve como respuesta final.
    return Array.from(projectsMap.values());
  }

  //Actualizar algún campo de la tabla (Uno sólo o los dos)
  async update(dto: UpdateTaskStaffDto) { //Recibe el DTO dto, que contiene: old_task_id, old_staff_id, new_task_id, new_staff_id
    //Busca la relación con findOne usando combinación de task.id y staff.id. Es decir, busca la fila actual en la tabla task_staff que conecta La tarea con ID old_task_id y el empleado con ID old_staff_id
    const relacion = await this.taskStaffRepo.findOne({
      where: {
        task: { id: dto.old_task_id },
        staff: { id: dto.old_staff_id },
      },
      relations: ['task', 'staff'], //Buen uso de relations: ['task', 'staff'] para tener acceso completo al objeto. Usas relations: ['task', 'staff'] para que también se carguen los objetos completos de la relación (no solo los IDs).
    });
  
    //Si no encuentra la relación, lanza NotFoundException.
    if (!relacion) throw new NotFoundException('Relación no encontrada');
  
    //Solo actualiza los valores si vienen en el DTO.
    if (dto.new_task_id) {
      // Buscas en la base de datos la nueva tarea por ID.
      const nuevaTarea = await this.taskRepo.findOne({ where: { id: dto.new_task_id } });
      // Si la tarea nueva no existe, lanzas error 404.
      if (!nuevaTarea) throw new NotFoundException('Tarea no encontrada');
      //Asignas la nueva tarea a la relación. Aún no guardas nada en la base de datos
      relacion.task = nuevaTarea;
    }
  
    //Igual que antes, pero para el empleado:
    if (dto.new_staff_id) {
      const nuevoStaff = await this.staffRepo.findOne({ where: { id: dto.new_staff_id } });
      if (!nuevoStaff) throw new NotFoundException('Empleado no encontrado');
      relacion.staff = nuevoStaff;
    }
  
    //Guardas la relación modificada en la base de datos.
    return await this.taskStaffRepo.save(relacion);
  }



  //Borrar una relación entre tarea y empleado
  async deleteByTaskAndStaff(dto: DeleteTaskStaffDto): Promise<string> {
    //Busca la relación por combinación de task.id + staff.id
    const relacion = await this.taskStaffRepo.findOne({
      where: {
        task: { id: dto.id_task },
        staff: { id: dto.id_staff },
      },
    });
  
    // Si no la encuentra, lanza error 404
    if (!relacion) {
      throw new NotFoundException('Relación no encontrada');
    }
  
    //Si la encuentra, la elimina usando remove()
    await this.taskStaffRepo.remove(relacion);
    return 'Relación eliminada correctamente';
  }

  //Método para encontrar las tareas que vencen el día posterior al actual
  async findTasksDueTomorrow(): Promise<{ title: string, deadline: string, email: string }[]> {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const yyyyMMdd = mañana.toISOString().split('T')[0];
  
    return this.taskStaffRepo
      .createQueryBuilder('ts')
      .leftJoin('ts.task', 'task') // ajusta el nombre real del campo
      .leftJoin('ts.staff', 'staff') // ajusta el nombre real del campo
      .select([
        'task.title AS title',
        'task.deadline AS deadline',
        'staff.email AS email',
      ])
      .where('task.deadline = :fecha', { fecha: yyyyMMdd })
      .getRawMany(); // El resultado de este select no es una entidad completa, sino una lista de objetos con los campos personalizados (title, deadline, email).
  }
}