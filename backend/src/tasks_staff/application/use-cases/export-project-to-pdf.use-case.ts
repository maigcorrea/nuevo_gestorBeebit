import { Injectable } from '@nestjs/common';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';
import * as PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { Inject } from '@nestjs/common';
import { TASK_STAFF_REPOSITORY } from 'src/tasks_staff/domain/token/tasks-staff-repository.token';

@Injectable()
export class ExportProjectsToPDFUseCase {
  constructor(
    @Inject(TASK_STAFF_REPOSITORY)
    private readonly taskStaffRepo: TaskStaffRepositoryPort) {}

  async execute(ids: string[], ability: AppAbility): Promise<Buffer> {
    const relaciones = await this.taskStaffRepo.findTaskStaffWithProjectByProjectIds(ids);

    const proyectosMap = new Map();

    for (const rel of relaciones) {
      const proyecto = rel.task.associated_project;
      if (!proyecto || !ability.can('read', proyecto)) continue;

      if (!proyectosMap.has(proyecto.id)) {
        proyectosMap.set(proyecto.id, {
          ...proyecto,
          tareas: [],
        });
      }

      proyectosMap.get(proyecto.id).tareas.push({
        ...rel.task,
        empleados: [rel.staff.name],
      });
    }

    const doc = new PDFDocument();
    const stream = new PassThrough();
    const chunks: any[] = [];

    doc.pipe(stream);

    for (const proyecto of proyectosMap.values()) {
      doc.fontSize(16).text(`Proyecto: ${proyecto.title}`, { underline: true });
      doc.text(`Descripción: ${proyecto.description || '---'}`);
      doc.text(`Inicio: ${new Date(proyecto.start_date).toLocaleDateString()}`);
      doc.text(`Deadline: ${proyecto.deadline ? new Date(proyecto.deadline).toLocaleDateString() : '---'}`);
      doc.text(`Estado: ${proyecto.status}`);
      doc.moveDown();

      doc.fontSize(14).text('Tareas:', { underline: true });
      proyecto.tareas.forEach(tarea => {
        doc.fontSize(12).text(`- ${tarea.title} (${tarea.completed ? 'Completada' : 'Pendiente'}) - Empleado: ${tarea.empleados.join(', ')}`);
      });

      doc.addPage();
    }

    doc.end();

    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
