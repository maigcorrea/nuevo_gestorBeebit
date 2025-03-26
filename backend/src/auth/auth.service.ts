import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Staff } from '../staff/entities/staff.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.staffRepo.findOne({ where: { email }, select: ['id', 'name', 'email', 'password', 'type'] });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.type };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}