import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mi_clave_secreta',
    });
  }

  async validate(payload: any) {
    
    console.log('[JWT STRATEGY] Payload recibido:', payload);
    return { userId: payload.sub, email: payload.email, type: payload.type };
  }
}
