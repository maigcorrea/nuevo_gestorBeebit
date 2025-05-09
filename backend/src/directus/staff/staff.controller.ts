// /directus/staff/staff.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from './use-cases/login.use-case';

@Controller('directus/staff')
export class StaffController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    console.log("entra");
    return this.loginUseCase.execute(email, password);
  }
}
