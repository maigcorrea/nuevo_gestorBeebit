import { Injectable } from '@nestjs/common';
import { TaskStaffRepositoryPort } from '../../domain/ports/task-staff.repository.port';

@Injectable()
export class FindTasksDueTomorrowUseCase {
  constructor(private readonly taskStaffRepo: TaskStaffRepositoryPort) {}

  async execute(): Promise<{ title: string; deadline: string; email: string }[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyyMMdd = tomorrow.toISOString().split('T')[0];

    return this.taskStaffRepo.findTasksDueTomorrow(yyyyMMdd);
  }
}
