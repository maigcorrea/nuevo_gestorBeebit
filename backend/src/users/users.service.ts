// Importamos el decorador Injectable para poder inyectar este servicio en otros lugares.
import { Injectable } from '@nestjs/common';
// Importamos InjectRepository para poder inyectar el repositorio de TypeORM.
import { InjectRepository } from '@nestjs/typeorm';
// Importamos el tipo Repository desde TypeORM, que es lo que usaremos para interactuar con la base de datos.
import { Repository } from 'typeorm';
// Importamos la entidad User, que es el modelo que representa la tabla "user" en la base de datos.
import { User } from './entities/user.entity'; 
// Importamos el DTO que define cómo debe ser el objeto que recibe el método de creación de usuario.
// Es decir, aquí decides qué datos el usuario te puede enviar.
import { CreateUserDto } from './dto/create-user.dto';


// El decorador @Injectable indica que esta clase se puede inyectar como dependencia donde sea necesario.
@Injectable()
export class UsersService {
  // Constructor de la clase. Aquí se inyectan las dependencias necesarias para que el servicio funcione.
  constructor(
    // Inyectas el repositorio de TypeORM para la entidad User.
    // Esto te da acceso a todos los métodos de base de datos de TypeORM, como save(), find(), findOne(), etc.
    @InjectRepository(User) //Inyectamos el repositorio de la entidad User
    private usersRepository: Repository<User>, //Usamos el repositorio para interactuar con la base de datos
  ) {}

  // ✅ Método que recibe un DTO y lo guarda. createUserDto es un objeto que contiene name, email y password (los datos del usuario). Devuelve una promesa que se resuelve con el usuario recién creado.
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Creamos una nueva instancia de User a partir de los datos que nos llegan del DTO. TypeORM genera un objeto User pero NO lo guarda en la base de datos aún.
    const newUser = this.usersRepository.create(createUserDto);
    // save() hace dos cosas: inserta si es nuevo, actualiza si ya existe.
    return this.usersRepository.save(newUser);
  }

  // ✅ Si quieres tener este método separado, puedes dejarlo, aunque es redundante.
  // Otro método para crear usuarios, pero en lugar de recibir el DTO, recibe los datos por separado.
  // Es una alternativa al método create().
  async createUser(name: string, email: string, password: string): Promise<User> {
    // Creamos el nuevo usuario manualmente.
    const newUser = this.usersRepository.create({ name, email, password });
    // Lo guardamos en la base de datos.
    return this.usersRepository.save(newUser);
  }

  // Método que devuelve todos los usuarios de la base de datos.
  async findAll(): Promise<User[]> {
    // Llama al método find() de TypeORM, que trae todos los registros de la tabla user.
    return this.usersRepository.find();
  }

  // Método para buscar un usuario concreto por su id.
  async findOne(id: number): Promise<User | null> {
    // Llama al método findOne() de TypeORM, pasando el criterio de búsqueda (where).
    // Devuelve el usuario encontrado o null si no existe.
    return this.usersRepository.findOne({ where: { id } });
  }
}
