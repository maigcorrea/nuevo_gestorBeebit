import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { Staff } from '../../domain/entities/staff.entity';
import { StaffOrmEntity } from './staff.orm-entity';

@Injectable()
export class StaffRepository implements StaffRepositoryPort {
  constructor(
    @InjectRepository(StaffOrmEntity)
    private readonly repo: Repository<StaffOrmEntity>,
  ) {}

  async save(staff: Staff): Promise<Staff> {
    const entity = this.repo.create({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      password: staff.password,
      register_date: staff.register_date,
      type: staff.type,
      ...(staff.resetToken && { resetToken: staff.resetToken }),
      ...(staff.resetTokenExpiry && { resetTokenExpiry: staff.resetTokenExpiry }),
      ...(staff.profileImage && { profileImage: staff.profileImage }),
    });

    const saved = await this.repo.save(entity);
    return this.mapToDomain(saved);
  }

  async findByEmail(email: string): Promise<Staff | null> {
    const entity = await this.repo.findOneBy({ email });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findById(id: string): Promise<Staff | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.mapToDomain(entity) : null;
  }

  async update(staff: Staff): Promise<Staff> {
    await this.repo.update({ id: staff.id }, {
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      password: staff.password,
      type: staff.type,
      resetToken: staff.resetToken,
      resetTokenExpiry: staff.resetTokenExpiry,
      ...(staff.profileImage && { profileImage: staff.profileImage }),
    });

    const updated = await this.repo.findOneBy({ id: staff.id });
    if (!updated) throw new Error('Empleado no encontrado después de actualizar');
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private mapToDomain(entity: StaffOrmEntity): Staff {
    return new Staff(
      entity.id,
      entity.name,
      entity.email,
      entity.phone,
      entity.password,
      entity.register_date,
      entity.type,
      entity.resetToken,
      entity.resetTokenExpiry,
      entity.profileImage,
    );
  }
}
