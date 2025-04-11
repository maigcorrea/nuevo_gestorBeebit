import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { CreateStaffDto } from '../staff2/infrastructure/dto/create-staff.dto';
 import { UpdateStaffDto } from './dto/update-staff.dto';
 import { StaffResponseDto } from './dto/staff-response.dto';
 import { NotFoundException } from '@nestjs/common';
 import { BadRequestException } from '@nestjs/common';
 import { MailService } from 'src/mail/mail.service';
import { Staff } from '../staff2/domain/entities/staff.entity';
import * as bcryptjs from 'bcryptjs';//Importamos bcrypt
import { InternalServerErrorException, ConflictException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { ForbiddenException } from '@nestjs/common';

@Injectable()

export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private staffRepository: Repository<Staff>,
        private readonly mailService: MailService,
        private readonly mailQueueService: MailQueueService,
    ) {}

    async create(createStaffDto: CreateStaffDto, ability: AppAbility): Promise<Staff>{
        if (!ability.can('create', Staff)) {
            throw new ForbiddenException('No tienes permiso para crear nuevos empleados');
        }

            // Creamos una nueva instancia de User a partir de los datos que nos llegan del DTO. TypeORM genera un objeto User pero NO lo guarda en la base de datos aún.
        const { register_date,password, ...userData } = createStaffDto;
        console.log("EStá")

        try{
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
            return await this.staffRepository.save(staff);

        }catch(error){
            // Si hay conflicto de datos únicos (nombre, email, teléfono)
            if (error.code === '23505') {
                throw new ConflictException('Ya existe un usuario con ese nombre, email o teléfono');
            }

            console.error('❌ Error al crear el empleado:', error);
            throw new InternalServerErrorException('Error al crear el usuario');
        }
        
    } 

    

    //Método para mostrar los datos del empleado en base a un id
    async findById(id_staff:string):Promise<Staff>{
        const staff = await this.staffRepository.findOneBy({ id: id_staff });

        if (!staff) {
            throw new NotFoundException(`No se encontró el empleado con id ${id_staff}`);
        }

        return staff;
    }



    // Método que devuelve todos los usuarios de la base de datos.
    async findAll(ability: AppAbility): Promise<Staff[]> {
        if (!ability.can('read', Staff)) {
            throw new ForbiddenException('No tienes permiso para ver los empleados');
        }
        // Llama al método find() de TypeORM, que trae todos los registros de la tabla user.
        return this.staffRepository.find();
    }



    //Método para actualizar la información de un empleado
    async updateStaff(id: string, updateDto: UpdateStaffDto, ability:AppAbility):Promise<{message:string}>{
        const staff = await this.staffRepository.findOneBy({ id });
              
        if (!staff) {
            throw new NotFoundException(`No se encontró el proyecto con id ${id}`);
        }
        console.log('Staff recuperado:', staff);
        console.log('ID usuario logueado:', ability.rulesFor('update', Staff)[0]?.conditions);


        if (!ability.can('update',staff )) {
            throw new ForbiddenException('No tienes permiso para actualizar la información de un empleado');
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
    async deleteStaff(id: string, ability: AppAbility): Promise<{message: string }> {
        const staff = await this.staffRepository.findOneBy({ id });

        if (!staff) {
            throw new NotFoundException(`No se encontró el empleado con id ${id}`);
        }

        if (!ability.can('delete', staff)) {
            throw new ForbiddenException('No tienes permiso para eliminar este empleado');
        }
        
        const result = await this.staffRepository.delete(id);
      
        if (result.affected === 0) {
          throw new NotFoundException(`No se encontró el empleado con id ${id}`);
        }

        return { message: `Empleado con id ${id} eliminado con éxito` };
    }



    //Método para comprobar si un nombre ya existe en la bd antes de enviar el form de registro desde el frontend
    async nameExist(name: string): Promise<boolean> {
        const user = await this.staffRepository.findOneBy({ name });
        return !!user;
    }




    //Método para comprobar si un email ya existe en la bd antes de enviar el form de registro desde el frontend
    async existeEmail(email: string): Promise<boolean> {
        const user = await this.staffRepository.findOneBy({ email });
        return !!user;
    }



    //Método para comprobar si un teléfono ya existe en la bd antes de enviar el form de registro desde el frontend
    async phoneExist(phone: string): Promise<boolean> {
        const user = await this.staffRepository.findOneBy({ phone });
        return !!user;
    }


     //Método para verificar si una contraseña es correcta (Al modificar la contraseña, paso de verificación)
     async verifyPassword(userId: string, plainPassword: string): Promise<boolean> {
        const user = await this.staffRepository.findOne({
            where: { id: userId },
            select: ['id', 'password'], // <-- Aquí aseguras que venga la contraseña
        });

        if (!user || !user.password) return false;
    
        console.log('Usuario encontrado:', user);
        console.log('Contraseña almacenada:', user.password);
        return bcryptjs.compare(plainPassword, user.password);
    }

     //Método para cambiar nueva contraseña
     async changePassword(userId: string, newPassword: string, ability: AppAbility): Promise<boolean> {
        
        if (!ability.can('update', Staff)) {
            throw new ForbiddenException('No tienes permiso para cambiar la contraseña');
        }

        const user = await this.staffRepository.findOne({ where: { id: userId } });
        if (!user) return false;
      
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
      
        await this.staffRepository.save(user);
        return true;
      }

    //Método para enviar email para recuperar la contraseña
    async handleForgotPassword(email: string) {
        const user = await this.staffRepository.findOne({ where: { email } });
      
        if (!user) {
          // No revelamos si existe o no, por seguridad
          return { message: 'Si el email está registrado, recibirás un correo' };
        }
      
        // Aquí se puede generar un token de recuperación
        // Generar token aleatorio y caducidad de 1 hora
        const token = randomBytes(32).toString('hex'); //uuid();
        user.resetToken = token;
        user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

        await this.staffRepository.save(user);

        const resetLink = `http://localhost:3001/reset-password?token=${token}`;

        //En vez de llamar directamente, lo enviamos a la cola
        await this.mailQueueService.enqueuePasswordReset(email, resetLink);
        
      
        return { message: 'Correo de recuperación enviado' };
      }
      
    

    //Método para establecer nueva contraseña al recuperar contraseña
    async resetPassword(token: string, newPassword: string, ability: AppAbility): Promise<{ message: string }> {
        if (!ability.can('update', Staff)) {
            throw new ForbiddenException('No tienes permiso para modificar la contraseña');
        }

        const user = await this.staffRepository.findOne({ where: { resetToken: token } });
      
        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
          throw new BadRequestException('Token inválido o expirado');
        }
      
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
      
        // Invalidar token para evitar que se reutilice ese enlace
        user.resetToken = null;
        user.resetTokenExpiry = null;
      
        await this.staffRepository.save(user);
      
        return { message: 'Contraseña actualizada correctamente' };
    }


    //Guardar la imagen del usuario en la bd
    async saveProfileImage(userId: string, imageUrl: string): Promise<void> {
        const user = await this.staffRepository.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('Usuario no encontrado');
      
        user.profileImage = imageUrl;
        await this.staffRepository.save(user);
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
