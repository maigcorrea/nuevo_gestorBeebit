import { ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { Staff } from '../../domain/entities/staff.entity';
import { CreateStaffInput } from '../../domain/interfaces/create-staff.input';
import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { StaffType } from '../../domain/entities/staff.entity';
import { AppAbility } from 'src/casl/casl-ability.factory'; // Asegúrate de ajustar la ruta según tu proyecto


export class CreateStaffUseCase {
    constructor(
      private readonly staffRepo: StaffRepositoryPort,
    ) {}
  
    async execute(input: CreateStaffInput, ability: AppAbility): Promise<Staff> {
      if (!ability.can('create', Staff)) {
        throw new ForbiddenException('No tienes permiso para crear nuevos empleados');
      }
  
      try {
        const hashedPassword = await bcryptjs.hash(input.password, 10);
  
        const staff = new Staff(
          crypto.randomUUID(),
          input.name,
          input.email,
          input.phone,
          hashedPassword,
          input.register_date ? new Date(input.register_date) : new Date(),
          input.type ?? StaffType.USER,
          null,
          null,
          null
        );
  
        return await this.staffRepo.save(staff);
  
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('Ya existe un usuario con ese nombre, email o teléfono');
        }
  
        console.error('❌ Error al crear el empleado:', error);
        throw new InternalServerErrorException('Error al crear el usuario');
      }
    }
  }