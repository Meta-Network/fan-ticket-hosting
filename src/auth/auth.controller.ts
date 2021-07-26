import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { utils } from 'ethers';
import { SignatureService } from 'src/signature/signature.service';
import { GeneralResponse } from 'src/types';
import { UserLoginDTO } from 'src/types/login-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly sigService: SignatureService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body() loginData: UserLoginDTO,
  ): Promise<GeneralResponse<string>> {
    // if sig OK, address will be returned
    // otherwise error will be throw in `verify`,
    const who = this.sigService.verifyLoginSignature(loginData);
    const checksumedAddress = utils.getAddress(who);
    const user = await this.userService.findOne({ address: checksumedAddress });

    if (!user) {
      throw new BadRequestException('You are not registered with us yet.');
    }
    await this.userService.syncMatatakiProfileTo(user);
    const token = this.service.getJWTFromUser(user);
    return { code: 200, data: token };
  }
}
