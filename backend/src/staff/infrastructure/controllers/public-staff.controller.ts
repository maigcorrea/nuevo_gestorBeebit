import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckEmailExistsUseCase } from 'src/staff/application/use-cases/check-email-exists.use-case';
import { CheckNameExistsUseCase } from 'src/staff/application/use-cases/check-name-exists.use-case';
import { CheckPhoneExistsUseCase } from 'src/staff/application/use-cases/check-phone-exists.use-case';
import { VerifyPasswordDto } from '../dto/verify-password.dto';
import { VerifyPasswordUseCase } from 'src/staff/application/use-cases/verify-password.use-case';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { HandleForgotPasswordUseCase } from 'src/staff/application/use-cases/handle-forgot-password.use-case';

@ApiTags('Public Staff') // Controlador para rutas públicas(SIn token jwt)
@Controller('public-staff')
export class PublicStaffController {
  constructor(
    private readonly checkEmailExistsUseCase: CheckEmailExistsUseCase,
    private readonly checkNameExistsUseCase: CheckNameExistsUseCase,
    private readonly checkPhoneExistsUseCase: CheckPhoneExistsUseCase,
    private readonly verifyPasswordUseCase: VerifyPasswordUseCase,
    private readonly handleForgotPasswordUseCase: HandleForgotPasswordUseCase,
  ) {}


  @Get('emailExists/:email')
  @ApiOperation({ summary: 'Comprobar si un email ya está registrado' })
  @ApiResponse({ status: 200, description: 'Resultado de la comprobación' })
    async existeEmail(@Param('email') email: string): Promise<{ exists: boolean }> {
        const exists = await this.checkEmailExistsUseCase.execute(email);
        return { exists };
    }




    @Get('nameExists/:name')
    @ApiOperation({ summary: 'Comprobar si un nombre ya está registrado' })
    @ApiResponse({ status: 200, description: 'Resultado de la comprobación' })
    async nameExists(@Param('name') name: string): Promise<{ exists: boolean }> {
      const exists = await this.checkNameExistsUseCase.execute(name);
      return { exists };
    }



    @Get('phoneExists/:phone')
    @ApiOperation({ summary: 'Comprobar si un teléfono ya está registrado' })
    @ApiResponse({ status: 200, description: 'Resultado de la comprobación' })
    async phoneExists(@Param('phone') phone: string): Promise<{ exists: boolean }> {
        const exists = await this.checkPhoneExistsUseCase.execute(phone);
        return { exists };
    }



    @Post('passwordVerify')
    @ApiOperation({ summary: 'Comprobar si las contraseña introducida es la correcta' })
    @ApiResponse({ status: 200, description: 'Resultado de la comprobación' })
        async verifyPassword(@Body() body: VerifyPasswordDto): Promise<{ valid: boolean }> {
            const isValid = await this.verifyPasswordUseCase.execute(body);
            return { valid: isValid };
        }






    @Post('forgot-password')
        @ApiOperation({ summary: 'Enviar correo para recuperar la contraseña' })
        @ApiResponse({
        status: 200,
        schema: {
            example: {
            message: 'Si el email está registrado, recibirás un correo',
            },
        },
        })
        async forgotPassword(@Body() body: ForgotPasswordDto) {
            return this.handleForgotPasswordUseCase.execute(body);
        }




    
}