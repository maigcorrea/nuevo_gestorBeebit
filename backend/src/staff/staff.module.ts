import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from './entities/staff.entity'; // Importamos la entidad Staff
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])], // Registrar el repositorio Staff
  providers: [StaffService, MailService],
  controllers: [StaffController],
})
export class StaffModule {}