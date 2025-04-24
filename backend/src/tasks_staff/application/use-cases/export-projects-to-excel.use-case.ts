import { Injectable } from '@nestjs/common';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';
import { Inject } from '@nestjs/common';
import { TASK_STAFF_REPOSITORY } from 'src/tasks_staff/domain/token/tasks-staff-repository.token';

@Injectable()
export class ExportProjectsToExcelUseCase {
  constructor(
    @Inject(TASK_STAFF_REPOSITORY)
    private readonly taskStaffRepo: TaskStaffRepositoryPort) {}

  async execute(ids: string[], ability: AppAbility): Promise<Buffer> {
    const relaciones = await this.taskStaffRepo.findTaskStaffWithProjectByProjectIds(ids);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Proyectos');

    worksheet.columns = [
      { header: 'Proyecto', key: 'project', width: 30 },
      { header: 'Descripción', key: 'description', width: 30 },
      { header: 'Inicio', key: 'start', width: 15 },
      { header: 'Deadline', key: 'deadline', width: 15 },
      { header: 'Tarea', key: 'task', width: 30 },
      { header: 'Completada', key: 'completed', width: 12 },
      { header: 'Empleado', key: 'staff', width: 25 },
    ];

    for (const rel of relaciones) {
      const proyecto = rel.task.associated_project;
      if (!proyecto || !ability.can('read', rel)) continue;

      worksheet.addRow({
        project: proyecto.title,
        description: proyecto.description,
        start: proyecto.start_date ? new Date(proyecto.start_date).toLocaleDateString() : '',
        deadline: proyecto.deadline ? new Date(proyecto.deadline).toLocaleDateString() : '',
        task: rel.task.title,
        completed: rel.task.completed ? 'Sí' : 'No',
        staff: rel.staff.name,
      });
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}
