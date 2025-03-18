import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // Importamos la entidad User

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registrar el repositorio User
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
