import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Get('kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    kakaoCallback(@Req() req: any) {
        return this.authService.validateOauthLogin(req.user);
    }
}