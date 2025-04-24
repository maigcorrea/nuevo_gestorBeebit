import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Staff } from '../staff/domain/entities/staff.entity';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { StaffRepositoryPort } from 'src/staff/domain/ports/staff.repository.port';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';

@Injectable()
export class AuthService {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private staffRepo: StaffRepositoryPort,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    //Busca el usuario por email. Solo selecciona los campos necesarios, incluyendo password para compararla.
    const user = await this.staffRepo.findByEmailWithPassword(email);


    // Si el usuario existe y la contraseña es válida, elimina la password del objeto con destructuring ({ password, ...result }).
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      //Devuelve el resto del usuario (result), sin contraseña.
      return result;
    }
    //Si no se encuentra o la contraseña no coincide, devuelve null.
    return null;
  }

  async login(user: StaffOrmEntity) {
    //Crea el payload que se incluirá en el JWT. sub (subject) suele ser el ID del usuario
    const payload = { sub: user.id, email: user.email, type: user.type, profileImage:user.profileImage};
    return {
      //Devuelve el token con access_token. También devuelve los datos del usuario (sin password, porque ya la eliminaste en validateUser()).
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}