import {
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import * as bcryptjs from 'bcryptjs';
  import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
  import { AppAbility } from 'src/casl/casl-ability.factory';
  import { Staff } from '../../domain/entities/staff.entity';
  import { UpdateStaffInput } from '../../domain/interfaces/update-staff.input';
  
  export class UpdateStaffUseCase {
    constructor(private readonly staffRepo: StaffRepositoryPort) {}
  
    async execute(
      id: string,
      input: UpdateStaffInput,
      ability: AppAbility,
    ): Promise<{ message: string }> {
      const staff = await this.staffRepo.findById(id);
  
      if (!staff) {
        throw new NotFoundException(`No se encontró el empleado con id ${id}`);
      }
  
      if (!ability.can('update', staff)) {
        throw new ForbiddenException('No tienes permiso para actualizar la información de un empleado');
      }
  
      const { email, phone, password, type } = input;
  
      if (!email && !phone && !password && !type) {
        throw new BadRequestException('Debes proporcionar al menos un campo para actualizar');
      }
  
      if (email !== undefined) staff.email = email;
      if (phone !== undefined) staff.phone = phone;
      if (password !== undefined) {
        const hashedPassword = await bcryptjs.hash(password, 10);
        staff.password = hashedPassword;
      }
      if (type !== undefined) staff.type = type;
  
      await this.staffRepo.save(staff);
  
      return { message: `Empleado con id ${id} actualizado con éxito` };
    }
  }
  