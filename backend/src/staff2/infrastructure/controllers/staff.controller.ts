/*import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth , ApiParam, ApiBody} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from '../staff2/infrastructure/dto/create-staff.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from '../staff2/domain/entities/staff.entity';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { VerifyPasswordDto } from './dto/verify-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CheckAbilities } from 'src/casl/check-abilities.decorator';
import { AbilitiesGuard } from 'src/casl/abilities.guard';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Request } from 'express';
import { Req } from '@nestjs/common';*/

import { Body, Controller, Post, Req, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AbilitiesGuard } from 'src/casl/abilities.guard';
import { CheckAbilities } from 'src/casl/check-abilities.decorator';
import { ParseUUIDPipe } from '@nestjs/common';
import { Staff } from '../../domain/entities/staff.entity';
import { CreateStaffDto } from '../../infrastructure/dto/create-staff.dto';
import { CreateStaffUseCase } from 'src/staff2/application/use-cases/create-staff.use-case';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { FindStaffByIdUseCase } from 'src/staff2/application/use-cases/find-staff-by-id.use-case';
import { StaffResponseDto } from '../../infrastructure/dto/staff-response.dto'; // si lo usas como return
import { FindAllStaffUseCase } from 'src/staff2/application/use-cases/find-all-staff.use-case';
import { UpdateStaffUseCase } from 'src/staff2/application/use-cases/update-staff.use-case';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { DeleteStaffUseCase } from 'src/staff2/application/use-cases/delete-staff.use-case';
import { CheckNameExistsUseCase } from 'src/staff2/application/use-cases/check-name-exists.use-case';
import { CheckEmailExistsUseCase } from 'src/staff2/application/use-cases/check-email-exists.use-case';
import { CheckPhoneExistsUseCase } from 'src/staff2/application/use-cases/check-phone-exists.use-case';
import { VerifyPasswordUseCase } from 'src/staff2/application/use-cases/verify-password.use-case';
import { VerifyPasswordDto } from '../dto/verify-password.dto';

@ApiTags('Staff')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
@Controller("staff")
export class StaffController{
    constructor(private readonly createStaffUseCase: CreateStaffUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly findStaffByIdUseCase: FindStaffByIdUseCase,
        private readonly findAllStaffUseCase: FindAllStaffUseCase,
        private readonly updateStaffUseCase: UpdateStaffUseCase,
        private readonly deleteStaffUseCase: DeleteStaffUseCase,
        private readonly checkNameExistsUseCase: CheckNameExistsUseCase,
        private readonly checkEmailExistsUseCase: CheckEmailExistsUseCase,
        private readonly checkPhoneExistsUseCase: CheckPhoneExistsUseCase,
        private readonly verifyPasswordUseCase: VerifyPasswordUseCase,
    ) {}

    @CheckAbilities({ action: 'create', subject: Staff })
    @Post()
    @ApiOperation({ summary: 'Introducir empleado en el sistema' })
    @ApiResponse({ status: 201, description: 'Empleado creado correctamente', type: StaffResponseDto })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(@Body() createStaffDto: CreateStaffDto, @Req() req: Request) {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
        return await this.createStaffUseCase.execute(createStaffDto, ability);
    }



    @UseGuards(AuthGuard('jwt')) // Solo autenticación, sin roles
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', description: 'ID del empleado (UUID)' })
    @ApiOperation({ summary: 'Mostrar un empleado por ID' })
    @ApiResponse({ status: 200, description: 'Empleado encontrado', type: StaffResponseDto })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<StaffResponseDto> {
      const staff = await this.findStaffByIdUseCase.execute(id);
      return StaffResponseDto.fromEntity(staff);
    }


    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: Staff })
    @Get('/all')
    @ApiOperation({ summary: 'Mostrar todos los empleados' })
    @ApiResponse({ status: 200, description: 'Listado de empleados', type: [StaffResponseDto] })
    @ApiResponse({ status: 403, description: 'No tienes permiso para ver los empleados' })
    async findAll(@Req() req: Request): Promise<StaffResponseDto[]> {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
        const empleados = await this.findAllStaffUseCase.execute(ability);
        return empleados.map(StaffResponseDto.fromEntity);
    }




    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: Staff })
    @Put('/update/:id')
    @ApiOperation({ summary: 'Actualizar un empleado determinado' })
    @ApiResponse({
      status: 200,
      description: 'Empleado actualizado con éxito',
      schema: {
        example: { message: 'Empleado actualizado con éxito' },
      },
    })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async updateStaff(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() updateDto: UpdateStaffDto,
      @Req() req: Request,
    ): Promise<{ message: string }> {
      const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
      return this.updateStaffUseCase.execute(id, updateDto, ability);
    }




    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'delete', subject: Staff })
    @Delete('/delete/:id')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Borrar un empleado determinado' })
    @ApiResponse({
    status: 200,
    description: 'Empleado eliminado con éxito',
    schema: {
        example: { message: 'Empleado eliminado con éxito' },
    },
    })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async deleteStaff(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
    ): Promise<{ message: string }> {
    const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
    return this.deleteStaffUseCase.execute(id, ability);
    }


    @Get('nameExists/:name')
    async nameExists(@Param('name') name: string): Promise<{ exists: boolean }> {
      const exists = await this.checkNameExistsUseCase.execute(name);
      return { exists };
    }
    



    @Get('emailExists/:email')
    async existeEmail(@Param('email') email: string): Promise<{ exists: boolean }> {
        const exists = await this.checkEmailExistsUseCase.execute(email);
        return { exists };
    }



    @Get('phoneExists/:phone')
    async phoneExists(@Param('phone') phone: string): Promise<{ exists: boolean }> {
        const exists = await this.checkPhoneExistsUseCase.execute(phone);
        return { exists };
    }




    @Post('passwordVerify')
    async verifyPassword(@Body() body: VerifyPasswordDto): Promise<{ valid: boolean }> {
        const isValid = await this.verifyPasswordUseCase.execute(body);
        return { valid: isValid };
    }
    /*
    //Endpoint para mostrar todos los usuarios de la base de datos.
    //@UseGuards(AuthGuard('jwt'), RolesGuard) //Para proteger también por rol, se añade RolesGuard
    //@Roles('admin')
    @ApiBearerAuth('jwt') // <- ¡Este es el importante!
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: Staff }) // Requiere permiso de lectura
    @Get("/all")
    @ApiOperation({summary:"Mostrar todos los empleados"})
    @ApiResponse({ status: 200, description: 'Listado de empleados', type: [StaffResponseDto] })
    @ApiResponse({ status: 404, description: 'No se encontraron empleados' })

    findAll(@Req() req: Request) {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
        // Llama al método findAll() del servicio, que devuelve un array de usuarios.
        return this.staffService.findAll(ability);
    }


    //Endpoint que devuelve todos los correos de todos los empleados
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: Staff })
    @Get('emails')
    async getAllEmails(@Req() req: Request): Promise<string[]> {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
        const users = await this.staffService.findAll(ability);
        return users.map(user => user.email); // solo devuelves los emails
    }



    // Mostrar un empleado por ID
    //@UseGuards(AuthGuard('jwt')) //No se protege por rol
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', description: 'ID del empleado (UUID)' }) 
    @ApiOperation({ summary: 'Mostrar un empleado por ID' })
    @ApiResponse({ status: 200, description: 'Empleado encontrado', type: StaffResponseDto })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async findById(@Param('id', new ParseUUIDPipe()) id: string) {
        console.log('ID recibido:', id);
        return this.staffService.findById(id);
    }



    //Endpoint para actualizar la información de un empleado en concreto
    //@UseGuards(AuthGuard('jwt')) //No rol
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: Staff })
    @Put("/update/:id")
    @ApiOperation({summary:"Actualizar una empleado determinado"})
    @ApiResponse({
        status: 200,
        description: 'Empleado actualizado con éxito',
        schema: {
          example: { message: 'Empleado actualizado con éxito' },
        },
      })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async updateStaff(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateStaffDto, @Req() req: Request) {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        console.log('User en req.user:', req.user);

        return this.staffService.updateStaff(id, updateDto, ability); //Se parsea a string el id por si viene en number
    }




    //Endpoint para eliminar un empleado
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'delete', subject: Staff })
    @Delete("/delete/:id")
    @ApiOperation({summary:"Borrar un empleado determinado"})
    @ApiResponse({ status: 201, description: 'Empleado eliminado con éxito',
        schema: {
          example: { message: 'Empleado actualizado con éxito' },
        },})
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async deleteStaff(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: Request) {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.staffService.deleteStaff(id, ability); // conviertes el string a número
    }



    //Endpoint para comprobar si un nombre ya existe antes de enviar el form de registro del front
    @Get('nameExists/:name')
    async NameExists(@Param('name') name: string) {
        const existe = await this.staffService.nameExist(name);
        return { exists: existe };
    }



    //Endpoint para comprobar si un email ya existe antes de enviar el formulario
    @Get('emailExists/:email')
    async existeEmail(@Param('email') email: string) {
        const existe = await this.staffService.existeEmail(email);
        return { exists: existe };
    }



    //Endpoint para comprobar si un teléfono ya existe en la bd antes de enviar el form de registro desde el frontend
    @Get('phoneExists/:phone')
    async phoneExists(@Param('phone') phone: string) {
        const existe = await this.staffService.phoneExist(phone);
        return { exists: existe };
    }

     //Endpoint para verificar si una contraseña es correcta (Al modificar la contraseña, paso de verificación)
     @Post('passwordVerify')
     async verifyPassword(@Body() body: VerifyPasswordDto,) {
         const isValid = await this.staffService.verifyPassword(body.userId, body.password);
         return { valid: isValid };
     }


      //Endpoint para cambiar nueva contraseña
      @ApiBearerAuth('jwt')
      @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
      @CheckAbilities({ action: 'update', subject: Staff })
      @Put('changePassword/:id')
      @ApiParam({ name: 'id', required: true, type: Number })
      @ApiBody({ type: ChangePasswordDto })
      async changePassword(
      @Param('id') id: string,
      @Body() body: ChangePasswordDto,
      @Req() req: Request
      ) {

        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
      const success = await this.staffService.changePassword(id, body.password, ability );
      if (!success) {
          throw new NotFoundException('Usuario no encontrado');
      }
  
      return { message: 'Contraseña actualizada correctamente' };
      }
 

    //Endpoint para mandar correo al recuperar contraseña
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.staffService.handleForgotPassword(email);
    }

    //Endpoint para establecer nueva contraseña al recuperarla
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: Staff })
    @Post('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto, @Req() req: Request) {
        const ability= this.caslAbilityFactory.createForUser(req.user as Staff);
        return this.staffService.resetPassword(body.token, body.newPassword, ability);
    }

    //Cargar foto de perfil
    @UseGuards(AuthGuard('jwt'))
    @Post('upload-profile-picture')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File, @Req() req: any // o extrae el ID del token
    ): Promise<{ url: string }> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo');
        }

        const fileName = `profile-pictures/${Date.now()}-${file.originalname}`;
        const {url} = await this.minioService.upload(file, fileName);

         // Extraer ID del usuario autenticado
        const userId = req.user.userId;
        console.log(req.user.userId);

        console.log("url:",url);
        // Guardar la URL o nombre del archivo en la BD
        await this.staffService.saveProfileImage(userId, url);

        return { url };
    }*/
}