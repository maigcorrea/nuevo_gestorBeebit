import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckEmailExistsUseCase } from 'src/staff/application/use-cases/check-email-exists.use-case';
import { CheckNameExistsUseCase } from 'src/staff/application/use-cases/check-name-exists.use-case';
import { CheckPhoneExistsUseCase } from 'src/staff/application/use-cases/check-phone-exists.use-case';
import { VerifyPasswordDto } from '../dto/verify-password.dto';
import { VerifyPasswordUseCase } from 'src/staff/application/use-cases/verify-password.use-case';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { HandleForgotPasswordUseCase } from 'src/staff/application/use-cases/handle-forgot-password.use-case';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResetPasswordUseCase } from 'src/staff/application/use-cases/reset-password.use-case';
import { ValidateTokenUseCase } from 'src/staff/application/use-cases/validate-token.use-case';

@ApiTags('Public Staff') // Controlador para rutas públicas(SIn token JWT)
@Controller('public-staff')
export class PublicStaffController {
    constructor(
        private readonly checkEmailExistsUseCase: CheckEmailExistsUseCase,
        private readonly checkNameExistsUseCase: CheckNameExistsUseCase,
        private readonly checkPhoneExistsUseCase: CheckPhoneExistsUseCase,
        private readonly verifyPasswordUseCase: VerifyPasswordUseCase,
        private readonly handleForgotPasswordUseCase: HandleForgotPasswordUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
        private readonly validateTokenUseCase: ValidateTokenUseCase,
    ) { }


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


    @Post('reset-password')
    @ApiOperation({ summary: 'Restablecer contraseña con token de recuperación' })
    @ApiResponse({
        status: 200,
        schema: {
            example: { message: 'Contraseña actualizada correctamente' },
        },
    })
    @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.resetPasswordUseCase.execute(body);
    }


    @Get('validate-token/:token')
    @ApiOperation({ summary: 'Validar token de recuperación de contraseña' })
    @ApiResponse({
        status: 200,
        description: 'Token válido',
    })
    @ApiResponse({
        status: 400,
        description: 'Token inválido o expirado',
    })
    async validateToken(@Param('token') token: string) {
        return this.validateTokenUseCase.execute(token);
    }

}