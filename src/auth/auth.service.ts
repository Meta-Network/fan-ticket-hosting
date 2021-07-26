import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { recoverPersonalSignature } from 'eth-sig-util';
import { MessageForLogin, MINUTE } from 'src/constant';
import { User } from 'src/entities/User.entity';
import { UserLoginDTO } from 'src/types/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getJWTFromUser(user: User): string {
    const payload = {
      username: user.username,
      sub: user.id,
      wallet: user.address,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
