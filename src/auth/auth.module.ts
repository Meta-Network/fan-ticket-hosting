import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PUBLIC_KEYS } from '@meta-network/auth-sdk';
import { JWTSetting } from 'src/constant';
import { AuthController } from './auth.controller';
require('dotenv').config();

@Module({
  imports: [
    JwtModule.register({
      publicKey: PUBLIC_KEYS.DEVELOPMENT,
      verifyOptions: {
        issuer: JWTSetting.issuer,
        audience: JWTSetting.audience,
        ignoreExpiration: process.env.NODE_ENV !== 'production',
      }
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
