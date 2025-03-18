import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

interface User extends CreateUserDto {
  id: number;
}

@Injectable()
export class UsersService {
  // Definimos el tipo de los usuarios como un arreglo de objetos User
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    // Creamos el nuevo usuario, asignando un id único
    const newUser = { id: this.users.length + 1, ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }
}
