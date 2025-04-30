import { Module } from '@nestjs/common';
import { ClockifyService } from './clockyfy.service';
import { ConfigModule } from '@nestjs/config';
import { ClockifyController } from './clockify.controller';

@Module({
  imports: [ ConfigModule],
  controllers: [ClockifyController],
  providers: [ClockifyService],
  exports: [ClockifyService],
})
export class ClockifyModule {}
