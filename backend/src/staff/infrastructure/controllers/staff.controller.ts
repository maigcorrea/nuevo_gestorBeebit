import { Body, Controller, Post, Req, UseGuards, Get, Param, Put, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AbilitiesGuard } from 'src/casl/abilities.guard';
import { CheckAbilities } from 'src/casl/check-abilities.decorator';
import { ParseUUIDPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Staff } from '../../domain/entities/staff.entity';
import { CreateStaffDto } from '../../infrastructure/dto/create-staff.dto';
import { CreateStaffUseCase } from 'src/staff/application/use-cases/create-staff.use-case';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { FindStaffByIdUseCase } from 'src/staff/application/use-cases/find-staff-by-id.use-case';
import { StaffResponseDto } from '../../infrastructure/dto/staff-response.dto';
import { FindAllStaffUseCase } from 'src/staff/application/use-cases/find-all-staff.use-case';
import { UpdateStaffUseCase } from 'src/staff/application/use-cases/update-staff.use-case';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { DeleteStaffUseCase } from 'src/staff/application/use-cases/delete-staff.use-case';
import { CheckNameExistsUseCase } from 'src/staff/application/use-cases/check-name-exists.use-case';
import { CheckEmailExistsUseCase } from 'src/staff/application/use-cases/check-email-exists.use-case';
import { CheckPhoneExistsUseCase } from 'src/staff/application/use-cases/check-phone-exists.use-case';
import { VerifyPasswordUseCase } from 'src/staff/application/use-cases/verify-password.use-case';
import { VerifyPasswordDto } from '../dto/verify-password.dto';
import { ChangePasswordUseCase } from 'src/staff/application/use-cases/change-password.use-case';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { SaveProfileImageUseCase } from 'src/staff/application/use-cases/save-profile-image.use-case';
import { MinioService } from 'src/infrastructure/minio/minio.service';
import { Express } from 'express';
import { StaffOrmEntity } from '../persistence/staff.orm-entity';


@ApiTags('Staff') //COntrolador para rutas protegidas(con JWT)
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
        private readonly changePasswordUseCase: ChangePasswordUseCase,
        private readonly saveProfileImageUseCase: SaveProfileImageUseCase,
        private readonly minioService: MinioService,
    ) {}

    @CheckAbilities({ action: 'create', subject: Staff })
    @Post()
    @ApiOperation({ summary: 'Introducir empleado en el sistema' })
    @ApiResponse({ status: 201, description: 'Empleado creado correctamente', type: StaffResponseDto })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(@Body() createStaffDto: CreateStaffDto, @Req() req: Request) {
        const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
        return await this.createStaffUseCase.execute(createStaffDto, ability);
    }



    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: StaffOrmEntity })
    @Get('/all')
    @ApiOperation({ summary: 'Mostrar todos los empleados' })
    @ApiResponse({ status: 200, description: 'Listado de empleados', type: [StaffResponseDto] })
    @ApiResponse({ status: 403, description: 'No tienes permiso para ver los empleados' })
    async findAll(@Req() req: Request): Promise<StaffResponseDto[]> {
        const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
        return await this.findAllStaffUseCase.execute(ability);
    }
    

    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'))
    @Get('emails')
    @ApiOperation({ summary: 'Obtener todos los correos electrónicos de los empleados' })
    @ApiResponse({
        status: 200,
        description: 'Lista de correos electrónicos',
        schema: {
            example: ['correo1@example.com', 'correo2@example.com']
        }
    })
    async getAllEmails(@Req() req: Request): Promise<string[]> {
        console.log('Req.user: ',req.user);
        const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
        const users = await this.findAllStaffUseCase.execute(ability);
        return users.map(user => user.email);
    }



    @UseGuards(AuthGuard('jwt')) // Solo autenticación, sin roles
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', description: 'ID del empleado (UUID)' })
    @ApiOperation({ summary: 'Mostrar un empleado por ID' })
    @ApiResponse({ status: 200, description: 'Empleado encontrado', type: StaffResponseDto })
    @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
    async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<StaffResponseDto> {
      const staff = await this.findStaffByIdUseCase.execute(id);
      return await this.findStaffByIdUseCase.execute(id);
    }
    







    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: StaffOrmEntity })
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
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      return this.updateStaffUseCase.execute(id, updateDto, ability);
    }




    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'delete', subject: StaffOrmEntity })
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
    const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
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




    @Put('changePassword/:id')
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'update', subject: StaffOrmEntity })
    @ApiParam({ name: 'id', required: true, type: String })
    @ApiBody({ type: ChangePasswordDto })
    @ApiOperation({ summary: 'Cambiar la contraseña de un usuario' })
    @ApiResponse({ status: 200, description: 'Contraseña actualizada correctamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
    @Req() req: Request,
    ): Promise<{ message: string }> {
    const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);

    const success = await this.changePasswordUseCase.execute(
        { userId: id, newPassword: body.newPassword },
        ability,
    );

    if (!success) {
        throw new NotFoundException('Usuario no encontrado');
    }

    return { message: 'Contraseña actualizada correctamente' };
    }





    @UseGuards(AuthGuard('jwt'))
    @Post('upload-profile-picture')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
    ): Promise<{ url: string }> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo');
        }

        const fileName = `profile-pictures/${Date.now()}-${file.originalname}`;
        const { url } = await this.minioService.upload(file, fileName);

        const userId = (req.user as StaffOrmEntity).id;
        const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);

        await this.saveProfileImageUseCase.execute({ userId, imageUrl: url }, ability);

        return { url };
    }
    
}