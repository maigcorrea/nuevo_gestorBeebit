import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { CreateStaffDto } from './dto/create-staff.dto';
 import { UpdateStaffDto } from './dto/update-staff.dto';
 import { StaffResponseDto } from './dto/staff-response.dto';
 import { NotFoundException } from '@nestjs/common';
 import { BadRequestException } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import * as bcryptjs from 'bcryptjs';//Importamos bcrypt

@Injectable()

export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private staffRepository: Repository<Staff>,
    ) {}

    async create(createStaffDto: CreateStaffDto): Promise<Staff>{
        // Creamos una nueva instancia de User a partir de los datos que nos llegan del DTO. TypeORM genera un objeto User pero NO lo guarda en la base de datos aún.
        const { register_date,password, ...userData } = createStaffDto;
        console.log("EStá")
        // Generamos el hash (10 es el salt rounds, número de encriptaciones, puedes cambiarlo, CUNATO MAYOR EL NÚMERO, MÁS SEGURO PERO MÁS LENTO
        //DA ERROR EN EL BCRYPT
        const hashedPassword =await bcryptjs.hash(password, 10);

        // 2. Creamos al usuario con la contraseña hasheada

        //AQUI SE CONSTRUYE A MANO, PERO ES MÁS EFICIENTE HACERLO CON CREATE (TEXTO DESCOMENTADO)
        //const user = new User();
        //user.name = userData.name;
        //user.email = userData.email;
        //mÁS DATOS COMO ROL, STATUS, ETC.
        //user.password = hashedPassword;//Guardamos el hash, no el texto plano

        //MÁS EFICIENTE
        const staff = this.staffRepository.create({
            ...userData,
            password: hashedPassword,
            register_date: register_date ? new Date(register_date) : new Date()
        });

        /*const staff= {
            name:"algo2",
            email:"algo2@gmail.com",
            register_date:"2025-02-20",
            phone: "682543620",
            password:"holaMundo_2"
        }*/


        
        // 3. Guardamos el usuario en la bd, save() hace dos cosas: inserta si es nuevo, actualiza si ya existe.
        return this.staffRepository.save(staff);
    } 

    

    //Método para mostrar los datos del empleado en base a un id
    async findById(id_staff:number):Promise<Staff>{
        const staff = await this.staffRepository.findOneBy({ id: id_staff });

        if (!staff) {
            throw new NotFoundException(`No se encontró el empleado con id ${id_staff}`);
        }

        return staff;
    }



    // Método que devuelve todos los usuarios de la base de datos.
    async findAll(): Promise<Staff[]> {
        // Llama al método find() de TypeORM, que trae todos los registros de la tabla user.
        return this.staffRepository.find();
    }



    //Método para actualizar la información de un empleado
    async updateStaff(id: number, updateDto: UpdateStaffDto):Promise<{message:string}>{
        const staff = await this.staffRepository.findOneBy({ id });
              
        if (!staff) {
            throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
        }
        
        //Al pasarle el objeto, De esta forma, desestructuramos solo una vez:
        const { email, phone, password, type } = updateDto;

        if (!email && !phone && !password && !type) {
            throw new BadRequestException('Debes proporcionar al menos un campo para actualizar');
        }

        
        if (email !== undefined) staff.email = email;
        if (phone !== undefined) staff.phone = phone;
        if (password !== undefined) {
            const hashedPassword = await bcryptjs.hash(password, 10);
            staff.password = hashedPassword;
        }
        if (type !== undefined) staff.type = type;

        await this.staffRepository.save(staff);

        return { message: `Proyecto con id ${id} actualizado con éxito` };
    }




    //Método para borrar un empleado
    async deleteStaff(id: number): Promise<{message: string }> {
        const result = await this.staffRepository.delete(id);
      
        if (result.affected === 0) {
          throw new NotFoundException(`No se encontró el empleado con id ${id}`);
        }

        return { message: `Empleado con id ${id} eliminado con éxito` };
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
