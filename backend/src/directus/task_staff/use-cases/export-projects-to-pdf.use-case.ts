import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { Buffer } from 'buffer';

@Injectable()
export class ExportProjectsToPDFUseCase {
  async execute(ids: string[], accessToken: string): Promise<Buffer> {
    const query = new URLSearchParams();
    query.append('filter[task][associated_project][id][_in]', ids.join(','));
    query.append('fields', 'id,task.*,task.associated_project.*,staff.*');

    const url = `${process.env.DIRECTUS_URL}/items/Task_staff?${query.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar Directus');
    }

    const data = await response.json();
    const relaciones = data.data;

    const proyectosMap = new Map();

    for (const rel of relaciones) {
      const proyecto = rel.task?.associated_project;
      const task = rel.task;
      const staff = rel.staff;

      if (!proyecto || !task || !staff) continue;

      if (!proyectosMap.has(proyecto.id)) {
        proyectosMap.set(proyecto.id, {
          ...proyecto,
          tareas: [],
        });
      }

      proyectosMap.get(proyecto.id).tareas.push({
        ...task,
        empleados: [`${staff.first_name || ''} ${staff.last_name || ''}`.trim()],
      });
    }

    const doc = new PDFDocument();
    const stream = new PassThrough();
    const chunks: any[] = [];

    doc.pipe(stream);

    const proyectos = Array.from(proyectosMap.values());

    proyectos.forEach((proyecto, i) => {
      doc.fontSize(16).text(`Proyecto: ${proyecto.title}`, { underline: true });
      doc.text(`Descripción: ${proyecto.description || '---'}`);
      doc.text(`Inicio: ${proyecto.start_date ? new Date(proyecto.start_date).toLocaleDateString('es-ES') : '---'}`);
      doc.text(`Deadline: ${proyecto.deadline ? new Date(proyecto.deadline).toLocaleDateString('es-ES') : '---'}`);
      doc.text(`Estado: ${proyecto.status || '---'}`);
      doc.moveDown();

      doc.fontSize(14).text('Tareas:', { underline: true });
      proyecto.tareas.forEach(tarea => {
        doc.fontSize(12).text(`- ${tarea.title} (${tarea.completed ? 'Completada' : 'Pendiente'}) - Empleado: ${tarea.empleados.join(', ')}`);
      });

      if (i < proyectos.length - 1) {
        doc.addPage();
      }
    });

    doc.end();

    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
