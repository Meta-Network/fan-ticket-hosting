import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CurrentUserId } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    @UseGuards(JwtAuthGuard)
    @Get("/me")
    getMe(
        @CurrentUserId() userId: number,
    ) {
        return { userId };
    }
}
