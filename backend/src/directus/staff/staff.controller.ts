// /directus/staff/staff.controller.ts

import { Body, Controller, Post, Get, Req, UnauthorizedException, Patch } from '@nestjs/common';
import { Request } from 'express';
import { LoginUseCase } from './use-cases/login.use-case';
import { CreateStaffUseCase } from './use-cases/create-staff.use-case';
import { CreateStaffDto } from './dto/create-staff.dto';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';

@Controller('directus/staff')
export class StaffController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createStaffUseCase: CreateStaffUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
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
}
