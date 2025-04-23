import {
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
  import { StaffOrmEntity as StaffSubject } from 'src/staff/infrastructure/persistence/staff.orm-entity';

  
  export class DeleteStaffUseCase {
    constructor(private readonly staffRepo: StaffRepositoryPort) {}
  
    async execute(id: string, ability: AppAbility): Promise<{ message: string }> {
      const staff = await this.staffRepo.findById(id);
  
      if (!staff) {
        throw new NotFoundException(`No se encontró el empleado con id ${id}`);
      }
  
      if (!ability.can('delete', StaffSubject)) {
        throw new ForbiddenException('No tienes permiso para eliminar este empleado');
      }
  
      await this.staffRepo.delete(id);
  
      return { message: `Empleado con id ${id} eliminado con éxito` };
    }
  }
  