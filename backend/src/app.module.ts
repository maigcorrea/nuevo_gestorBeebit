import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module'; // Tu módulo de usuarios
import { User } from './users/entities/user.entity'; // La entidad de usuario

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: 'postgres', // Host de la base de datos (puede ser un contenedor de Docker o una IP)
      port: 5432, // Puerto
      username: 'postgres', // Usuario de la base de datos
      password: 'password', // Contraseña de la base de datos
      database: 'test', // Nombre de la base de datos
      entities: [User], // Entidades que se utilizarán
      synchronize: true, // Sincroniza automáticamente la base de datos (solo en desarrollo)
    }),
    UsersModule, // Aquí importamos el módulo de usuarios
  ],
})
export class AppModule {}
