import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@ApiTags('[Auth] 인증')
@Controller('v1/auth')
export class AuthController {
    private JWT_REFRESH_SECRET: string;
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

    ) {
        this.JWT_REFRESH_SECRET = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    }

    @Get('kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    kakaoCallback(@Req() req: any) {
        return this.authService.validateOauthLogin(req.user);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Access Token 재발급' })
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        },
        },
    })
    async refreshToken(
        @Body('refreshToken') refreshToken: string
    ) {
        if (!refreshToken) throw new UnauthorizedException('refreshToken이 필요합니다.');

        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.JWT_REFRESH_SECRET
            });

            const user = await this.authService.findUser(payload.sub);
            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('유효하지 않은 refreshToken입니다.');
            }

            const newAccessToken = this.authService.issueToken('access', user);

            return {
                accessToken: newAccessToken,
            }
        } catch(e) {
            throw new UnauthorizedException('refreshToken이 만료되었거나 유효하지 않습니다.');
        }
    }
}