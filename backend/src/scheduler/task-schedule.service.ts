import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { Project } from 'src/project/domain/entities/project.entity';
import { TaskStaffOrmEntity } from 'src/tasks_staff/infrastructure/persistence/task-staff.orm-entity';
import { FindTasksDueTomorrowUseCase } from 'src/tasks_staff/application/use-cases/find-tasks-due-tomorrow.use-case';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PROJECT_REPOSITORY } from 'src/project/domain/token/project-repository.token';
import { ProjectRepositoryPort } from 'src/project/domain/ports/project.repository.port';
import { TASK_STAFF_REPOSITORY } from 'src/tasks_staff/domain/token/tasks-staff-repository.token';
import { TaskStaffRepositoryPort } from 'src/tasks_staff/domain/ports/task-staff.repository.port';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(TASK_STAFF_REPOSITORY)
    private readonly taskStaffRepo: TaskStaffRepositoryPort,
    private readonly mailQueueService: MailQueueService,
    private readonly findTasksDueTomorrow: FindTasksDueTomorrowUseCase,
  ) {}


  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // ⏰ Todos los días a las 00:00 EVERY_DAY_AT_MIDNIGHT
  async handleTaskReminder() {
      this.logger.log('🕛 Ejecutando revisión de deadlines...');

      // Aquí pondrás la lógica para buscar tareas cuyo deadline es mañana
      // y enviar correos o notificaciones


      // 1. Buscar tareas con deadline igual a esa fecha
      const tareas = await this.findTasksDueTomorrow.execute();

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
  }

    //Se envía un correo al administrador para recordarle que el día posterior al actual vence el plazo de entrega de un proyecto
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async notifyUpcomingProjectDeadlines() {
      this.logger.log('📌 Comprobando proyectos cuya deadline es mañana...');
  
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyyMMdd = tomorrow.toISOString().split('T')[0]; // "2025-04-05"
  
      const projects = await this.projectRepo.findProjectsDueOn(yyyyMMdd);
  
      for (const project of projects) {
        this.logger.warn(`⚠️ Proyecto "${project.title}" tiene deadline mañana.`);

        // Buscar todos los empleados asignados a tareas del proyecto
        const taskStaffList = await this.taskStaffRepo.find({
            relations: {
              task: {
                associated_project: true,
              },
              staff: true,
            },
        });

            // Filtrar por tareas que pertenezcan al proyecto actual
            const empleadosNotificados = new Set<string>();

            for (const rel of taskStaffList) {
                if (
                    rel.task &&
                    rel.task.associated_project &&
                    rel.task.associated_project.id === project.id &&
                    rel.staff?.email
                  ) {
                    const staffEmail = rel.staff.email;

                    // Evitar enviar duplicado
                    if (!empleadosNotificados.has(staffEmail)) {
                        empleadosNotificados.add(staffEmail);

                        await this.mailQueueService.sendMail({
                            to: staffEmail,
                            subject: `⏳ Proyecto próximo a vencer: ${project.title}`,
                            text: `Hola, el proyecto "${project.title}" al que estás asignado vence mañana (${project.deadline}).`,
                        });

                        this.logger.log(`📧 Correo enviado a ${staffEmail}`);
                    }
                }
            }

        }
    }
}