import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { DirectusAuthGuard } from 'src/common/guards/directus-auth.guard';
import { FindSentMessagesUseCase } from './use-cases/find-sent-messages.use-case';
import { FindReceivedMessagesUseCase } from './use-cases/find-received-messages.use-case';
import { SaveMessageUseCase } from './use-cases/save-message.use-case';

@Controller('directus/messages')
export class MessagesController {
  constructor(
    private readonly findSentMessagesUseCase: FindSentMessagesUseCase,
    private readonly findReceivedMessagesUseCase: FindReceivedMessagesUseCase,
    private readonly saveMessageUseCase: SaveMessageUseCase,
  ) {}

  @Get('enviados')
  @UseGuards(DirectusAuthGuard)
  async findSentMessages(@Req() req) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const userId = req.user?.data?.id; // 👈 sacamos el id del usuario loggeado

    const messages = await this.findSentMessagesUseCase.execute(token, userId);
    return { data: messages };
  }





  @Get('recibidos')
  @UseGuards(DirectusAuthGuard)
  async findReceivedMessages(@Req() req) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const userId = req.user?.data?.id;

    const messages = await this.findReceivedMessagesUseCase.execute(token, userId);
    return { data: messages };
  }




  @Post('save')
  @UseGuards(DirectusAuthGuard)
  async saveMessage(@Body() body, @Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const userId = req.user?.data?.id; // ID del que envía el mensaje

    return this.saveMessageUseCase.execute(token, userId, body);
  }
}

