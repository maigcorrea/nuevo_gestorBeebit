import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DirectusAuthGuard } from 'src/common/guards/directus-auth.guard';
import { FindSentMessagesUseCase } from './use-cases/find-sent-messages.use-case';

@Controller('directus/messages')
export class MessagesController {
  constructor(
    private readonly findSentMessagesUseCase: FindSentMessagesUseCase,
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
}

