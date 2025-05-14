// /directus/staff/staff.controller.ts

import { Body, Controller, Post, Get, Req, UnauthorizedException, Patch, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { LoginUseCase } from './use-cases/login.use-case';
import { CreateStaffUseCase } from './use-cases/create-staff.use-case';
import { CreateStaffDto } from './dto/create-staff.dto';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';
import { UploadProfilePictureUseCase } from './use-cases/update-profile-picture.use-case';
import { VerifyPasswordDto } from './dto/verify-password.dto';
import { VerifyPasswordUseCase } from './use-cases/verify-password.use-case';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordUseCase } from './use-cases/change-password.use-case';
import { GetEmailsUseCase } from './use-cases/get-emails.use-case';
import { CheckEmailExistsUseCase } from './use-cases/check-email-exists.use-case';

@Controller('directus/staff')
export class StaffController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createStaffUseCase: CreateStaffUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase,
    private readonly verifyPasswordUseCase: VerifyPasswordUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getEmailsUseCase: GetEmailsUseCase,
    private readonly checkEmailExistsUseCase: CheckEmailExistsUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    console.log("entra");
    return this.loginUseCase.execute(email, password);
  }




  @Post()
  async register(@Body() body: CreateStaffDto) {
    return this.createStaffUseCase.execute(body);
  }



  
  @Get()
  async getProfile(@Req() req: Request) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    return this.getProfileUseCase.execute(token);
  }





  @Patch('update/:id')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateStaffDto) {
    const authorization = req.headers.authorization;
    const userId = req.params.id;

    if (!authorization) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authorization.split(' ')[1];

    return this.updateProfileUseCase.execute(userId, dto, token);
  }




  @Post('upload-profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
    @Req() req: Request,
  ) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    const token = authorization.split(' ')[1];

    return this.uploadProfilePictureUseCase.execute(file.buffer, file.originalname, token, userId);
  }


  @Post('verify-password')
  async verifyPassword(@Body() body: VerifyPasswordDto) {
    console.log('entra a verify-password', body); // TEMPORAL
    const isValid = await this.verifyPasswordUseCase.execute(body.email, body.password);
    return { valid: isValid };
  }


  @Patch('change-password')
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    const token = authorization.split(' ')[1];
    const { newPassword } = body;

    return this.changePasswordUseCase.execute(token, newPassword);
  }



  @Get('emails')
  async getAllEmails(@Req() req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }
    const token = authorization.split(' ')[1];
    return this.getEmailsUseCase.execute(token);
  }


  
  @Get('email-exists/:email')
  async checkEmailExists(@Param('email') email: string, @Req() req: Request) {
    const authorization = req.headers.authorization;
    
    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    const exists = await this.checkEmailExistsUseCase.execute(email, token);
    return { exists };
  }
}
