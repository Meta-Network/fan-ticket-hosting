import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    @UseGuards(JwtAuthGuard)
    @Get("/me")
    getMe(@Request() req) {
        return { userId: req.user };
    }
}
