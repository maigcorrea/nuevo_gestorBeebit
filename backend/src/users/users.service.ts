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
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcryptjs';//Importamos bcrypt



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
  async create(createUserDto: CreateUserDto): Promise<User>{
    // Creamos una nueva instancia de User a partir de los datos que nos llegan del DTO. TypeORM genera un objeto User pero NO lo guarda en la base de datos aún.
    const { password, ...userData } = createUserDto;

    // Generamos el hash (10 es el salt rounds, número de encriptaciones, puedes cambiarlo, CUNATO MAYOR EL NÚMERO, MÁS SEGURO PERO MÁS LENTO
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Creamos al usuario con la contraseña hasheada

    //AQUI SE CONSTRUYE A MANO, PERO ES MÁS EFICIENTE HACERLO CON CREATE (TEXTO DESCOMENTADO)
    //const user = new User();
    //user.name = userData.name;
    //user.email = userData.email;
    //mÁS DATOS COMO ROL, STATUS, ETC.
    //user.password = hashedPassword;//Guardamos el hash, no el texto plano

    //MÁS EFICIENTE
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    
    // 3. GUardamos el usuario en la bd, save() hace dos cosas: inserta si es nuevo, actualiza si ya existe.
    return this.usersRepository.save(user);
  } 

  // ✅ Si quieres tener este método separado, puedes dejarlo, aunque es redundante. Es una alternativa al método create().
  // Otro método para crear usuarios, pero en lugar de recibir el DTO, recibe los datos por separado.
  async createUser(name: string, email: string, password: string): Promise<User>{
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
  
    return this.usersRepository.save(user);
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


  //async login(email: string, password: string): Promise<any> {
    // 1. Buscar al usuario por email
    //const user = await this.usersRepository.findOne({ where: { email } });
  
    //if (!user) {
      //throw new UnauthorizedException('Usuario no encontrado');
    //}
  
    // 2. Comparar la contraseña enviada con el hash de la base de datos
   // const isPasswordValid = await bcrypt.compare(password, user.password);
  
    //if (!isPasswordValid) {
      //throw new UnauthorizedException('Contraseña incorrecta');
    //}
  
    // 3. Si todo va bien, generar y devolver el token o el usuario (sin password)
   // const { password: _, ...userWithoutPassword } = user;
  
    //return {
      //message: 'Login exitoso',
     // user: userWithoutPassword,
      // // jwtToken: await this.jwtService.signAsync({...}) // si generas el token aquí
    //};
  //}
  
}
