import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { TaskStaffService } from 'src/tasks_staff/task-staff.service';
import { Project } from 'src/project/entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    private readonly taskStaffService: TaskStaffService,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly mailQueueService: MailQueueService,
  ) {}


  /*@Cron(CronExpression.EVERY_10_SECONDS) // ⏰ Todos los días a las 00:00 EVERY_DAY_AT_MIDNIGHT
  async handleTaskReminder() {
      this.logger.log('🕛 Ejecutando revisión de deadlines...');

      // Aquí pondrás la lógica para buscar tareas cuyo deadline es mañana
      // y enviar correos o notificaciones


      // 1. Buscar tareas con deadline igual a esa fecha
      const tareas = await this.taskStaffService.findTasksDueTomorrow();

      // 2. Enviar correos a los empleados asignados
      for (const tarea of tareas) {
        const { email, title, deadline } = tarea;

        this.logger.log(`✉️ Enviando recordatorio a ${email} por la tarea "${title}"`);

        await this.mailQueueService.sendMail({
            to: email,
            subject: '📌 Recordatorio de tarea próxima a vencer',
            text: `Hola, recuerda que la tarea "${title}" tiene como fecha límite el ${deadline}.`,
        });
    }

    this.logger.log(`✅ Recordatorios enviados: ${tareas.length}`);
  }*/

    //Se envía un correo al administrador para recordarle que el día posterior al actual vence el plazo de entrega de un proyecto
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async notifyUpcomingProjectDeadlines() {
      this.logger.log('📌 Comprobando proyectos cuya deadline es mañana...');
  
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyyMMdd = tomorrow.toISOString().split('T')[0]; // "2025-04-05"
  
      const projects = await this.projectRepo.find({
        where: {
          deadline: yyyyMMdd as any,
        },
      });
  
      for (const project of projects) {
        this.logger.warn(`⚠️ Proyecto "${project.title}" tiene deadline mañana.`);
  
        // (opcional) Notifica a alguien si lo necesitas
        await this.mailQueueService.sendMail({
          to: 'admin@gmail.com', // puedes cambiar esto a quien deba recibir
          subject: `📅 Deadline mañana: ${project.title}`,
          text: `El proyecto "${project.title}" vence mañana (${project.deadline}).`,
        });
      }
    }
}