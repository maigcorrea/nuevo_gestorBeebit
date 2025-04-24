import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { StaffOrmEntity } from 'src/staff/infrastructure/persistence/staff.orm-entity';
import { STAFF_REPOSITORY } from 'src/staff/domain/token/staff.token';
import { StaffRepository } from 'src/staff/infrastructure/persistence/staff.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffOrmEntity]),
    JwtModule.register({
      secret: 'mi_clave_secreta',
      signOptions: { expiresIn: '1d' }, //Duración del token
    }),
  ],
  providers: [AuthService, JwtStrategy,
    {
      provide: STAFF_REPOSITORY,
      useClass: StaffRepository,
    }
  ],
  controllers: [AuthController],
})
export class AuthModule {}
