import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Importamos la entidad User

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Inyectamos el repositorio de usuarios
    private usersRepository: Repository<User>, // Usamos el repositorio para interactuar con la base de datos
  ) {}

  async createUser(name: string, email: string, password: string): Promise<User> {
    const newUser = this.usersRepository.create({ name, email, password }); // Crea una nueva instancia
    return this.usersRepository.save(newUser); // Guarda el usuario en la base de datos
  }

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user); // Guardamos el usuario en la base de datos
  }

  // Método para obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.usersRepository.find(); // Obtenemos todos los usuarios
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } }); // Obtenemos un usuario por su ID. findOne ahora espera un objeto con un campo where que contiene las condiciones de búsqueda.
  }
}

