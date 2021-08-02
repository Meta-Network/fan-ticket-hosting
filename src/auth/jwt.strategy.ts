import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PUBLIC_KEYS } from '@meta-network/auth-sdk';
require('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => req.cookies['ucenter_accessToken'],
      secretOrKey: PUBLIC_KEYS.DEVELOPMENT,
      ignoreExpiration: process.env.NODE_ENV !== 'production',
      algorithms: ['RS256', 'RS384'],
    });
  }

  async validate(payload: {
    sub: number;
  }): Promise<number> {
    return payload.sub;
  }
}
