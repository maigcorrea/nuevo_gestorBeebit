// /directus/staff/staff.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from './use-cases/login.use-case';
import { CreateStaffUseCase } from './use-cases/create-staff.use-case';
import { CreateStaffDto } from './dto/create-staff.dto';

@Controller('directus/staff')
export class StaffController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createStaffUseCase: CreateStaffUseCase,
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
}
