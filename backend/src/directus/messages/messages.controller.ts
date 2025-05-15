import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DirectusAuthGuard } from 'src/common/guards/directus-auth.guard';
import { FindSentMessagesUseCase } from './use-cases/find-sent-messages.use-case';
import { FindReceivedMessagesUseCase } from './use-cases/find-received-messages.use-case';

@Controller('directus/messages')
export class MessagesController {
  constructor(
    private readonly findSentMessagesUseCase: FindSentMessagesUseCase,
    private readonly findReceivedMessagesUseCase: FindReceivedMessagesUseCase,
  ) {}

  @Get('enviados')
  @UseGuards(DirectusAuthGuard)
  async findSentMessages(@Req() req) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const userId = req.user.data.id ; // 👈 user.id es el ID en Directus
    console.log("TOKEN QUE LLEGA:", token);
    console.log("USERID: ", userId);

    return this.findSentMessagesUseCase.execute(token, userId);
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
}

