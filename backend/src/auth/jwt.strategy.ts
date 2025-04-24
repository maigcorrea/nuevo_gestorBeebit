import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(StaffOrmEntity)
    private readonly staffRepository: Repository<StaffOrmEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mi_clave_secreta',
    });
  }

  async validate(payload: any): Promise<StaffOrmEntity> {
    
    console.log('[JWT STRATEGY] Payload recibido:', payload);

     // Buscar el usuario completo en la base de datos (puedes incluir relaciones si lo deseas)
     const user = await this.staffRepository.findOne({
      where: { id: payload.sub },
      relations: ['sentMessages'], // 👈 solo si necesitas esa relación para CASL
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
  

    return user;
  }
}
