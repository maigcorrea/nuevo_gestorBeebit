import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Req, Get, Param  } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Mensajes') 
@ApiBearerAuth()
@Controller("messages")

export class MessagesController{

    constructor(private readonly messagesService: MessagesService) {}

    @Post('send')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Enviar un mensaje por correo' })
    @ApiResponse({ status: 201, description: 'Mensaje enviado correctamente' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async send(@Body() dto: SendMessageDto, @Req() req) {
        const senderId = req.user.userId; // extraído del JWT
        return this.messagesService.sendEmail(dto, senderId);
    }

    @Get('enviados')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Obtener mensajes enviados por un usuario' })
    @ApiResponse({ status: 200, description: 'Mensajes obtenidos correctamente' })
    async getSentMessages(@Req() req) {
        const userId = req.user['userId'];
        return this.messagesService.findSentMessagesByUser(userId);
    }

}