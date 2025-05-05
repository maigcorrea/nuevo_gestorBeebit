import { Staff } from '../../domain/entities/staff.entity';
import { StaffOrmEntity } from '../persistence/staff.orm-entity';
import { StaffResponseDto } from '../dto/staff-response.dto';

export class StaffMapper {
  // Orm → Dominio
  static toDomainEntity(entity: StaffOrmEntity): Staff {
    return new Staff(
      entity.id,
      entity.name,
      entity.email,
      entity.phone,
      entity.password, // aunque esté con `select: false`, asumimos que se carga si se usa aquí
      entity.register_date,
      entity.type,
      entity.resetToken,
      entity.resetTokenExpiry,
      entity.profileImage,
      entity.clockifyUserId ?? null,
    );
  }

  // Dominio → Orm
  static toOrmEntity(domain: Staff): StaffOrmEntity {
    const entity = new StaffOrmEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.phone = domain.phone;
    entity.password = domain.password;
    entity.register_date = domain.register_date;
    entity.type = domain.type;
    entity.resetToken = domain.resetToken;
    entity.resetTokenExpiry = domain.resetTokenExpiry;
    entity.profileImage = domain.profileImage;
    entity.clockifyUserId = domain.clockifyUserId ?? null;
    return entity;
  }

  // Dominio → DTO
  static toResponseDto(domain: Staff): StaffResponseDto {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      phone: domain.phone,
      profileImage: domain.profileImage ?? undefined,
      type: domain.type,
      register_date: domain.register_date,
      clockifyUserId: domain.clockifyUserId ?? undefined,
    };
  }
}
