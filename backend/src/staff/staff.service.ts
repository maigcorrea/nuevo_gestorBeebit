import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { CreateStaffDto } from './dto/create-staff.dto';
 import { UpdateStaffDto } from './dto/update-staff.dto';
 import { StaffResponseDto } from './dto/staff-response.dto';
 import { NotFoundException } from '@nestjs/common';
 import { BadRequestException } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import * as bcrypt from 'bcrypt';//Importamos bcrypt

@Injectable()

export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private staffRepository: Repository<Staff>,
    ) {}

    async create(createStaffDto: CreateStaffDto): Promise<Staff>{
        // Creamos una nueva instancia de User a partir de los datos que nos llegan del DTO. TypeORM genera un objeto User pero NO lo guarda en la base de datos aún.
        const { register_date, ...userData } = createStaffDto;
        console.log("Adios")
        // Generamos el hash (10 es el salt rounds, número de encriptaciones, puedes cambiarlo, CUNATO MAYOR EL NÚMERO, MÁS SEGURO PERO MÁS LENTO
        //DA ERROR EN EL BCRYPT
        //const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hey")
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
            //password: hashedPassword,
            register_date: register_date ? new Date(register_date) : new Date()
        });


        
        // 3. Guardamos el usuario en la bd, save() hace dos cosas: inserta si es nuevo, actualiza si ya existe.
        return this.staffRepository.save(staff);
    } 



    // Método que devuelve todos los usuarios de la base de datos.
    async findAll(): Promise<Staff[]> {
        // Llama al método find() de TypeORM, que trae todos los registros de la tabla user.
        return this.staffRepository.find();
    }

}
