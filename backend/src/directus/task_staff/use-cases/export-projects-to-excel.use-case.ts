import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';
//import { fetchFromDirectus } from '@/directus/common/helpers/fetch-from-directus'; // Suponiendo que tienes un helper genérico

@Injectable()
export class ExportProjectsToExcelUseCase {
  async execute(ids: string[], accessToken: string): Promise<Buffer> {
    const query = new URLSearchParams();
    query.append('filter[task][associated_project][id][_in]', ids.join(','));
query.append('fields', 'id,task.*, task.associated_project.*, staff.*'); // 👈 Esta línea clave

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
    console.log('RELACIONES:', JSON.stringify(relaciones, null, 2));

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
      const proyecto = rel.task?.associated_project;
      const task = rel.task;
      const staff = rel.staff;

      if (!proyecto || !task || !staff) continue;

      worksheet.addRow({
        project: proyecto.title || '',
        description: proyecto.description || '',
        start: proyecto.start_date ? new Date(proyecto.start_date).toLocaleDateString('es-ES') : '',
        deadline: proyecto.deadline ? new Date(proyecto.deadline).toLocaleDateString('es-ES') : '',
        task: task.title || '',
        completed: task.completed ? 'Sí' : 'No',
        staff: `${staff.first_name || ''} ${staff.last_name || ''}`.trim(), // 👈 Aquí importante
      });
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}
