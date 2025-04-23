import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    Get
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { SendMessageDto } from '../dto/send-message.dto';
  import { SendMessageUseCase } from 'src/messages2/application/use-cases/send-message.use-case';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { FindSentMessagesByUserUseCase } from 'src/messages2/application/use-cases/find-sent-messages-by-user.use-case';
  import { FindReceivedMessagesByUserUseCase } from 'src/messages2/application/use-cases/find-received-messages-by-user.use-case';
  
  @ApiTags('Messages')
  @Controller('messages')
  export class MessageController {
    constructor(
        private readonly sendMessageUseCase: SendMessageUseCase,
        private readonly findSentMessagesByUserUseCase: FindSentMessagesByUserUseCase,
        private readonly findReceivedMessagesByUserUseCase: FindReceivedMessagesByUserUseCase,
    ) {}
  
    @Post('send')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Enviar un mensaje por correo' })
    @ApiResponse({ status: 201, description: 'Mensaje encolado correctamente' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async send(@Body() dto: SendMessageDto, @Req() req) {
      const senderId = req.user.userId;
  
      const input = {
        senderId,
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
      };
  
      return this.sendMessageUseCase.execute(input);
    }




    @Get('enviados')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Obtener mensajes enviados por un usuario' })
    @ApiResponse({ status: 200, description: 'Mensajes obtenidos correctamente' })
    async getSentMessages(@Req() req) {
        const senderId = req.user.userId;
        return this.findSentMessagesByUserUseCase.execute({ senderId });
    }






      @Get('received')
      @UseGuards(AuthGuard('jwt'))
      @ApiOperation({ summary: 'Obtener mensajes recibidos por un usuario' })
      @ApiResponse({ status: 200, description: 'Mensajes obtenidos correctamente' })
      async getReceivedMessages(@Req() req) {
          const receiverId = req.user.userId;
          return this.findReceivedMessagesByUserUseCase.execute({ receiverId });
      }
  }
  