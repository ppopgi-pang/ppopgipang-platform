import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CookieOptions, Response } from "express";
import { AuthInput, AuthResult } from "@ppopgipang/types";
import { IsAdmin } from "./decorators/is-admin.decorator";
import { IgnoreJwtGuard } from "./decorators/ignore-jwt-guard.decorator";

@ApiTags('[Auth] 인증')
@Controller('v1/auth')
export class AuthController {
    private JWT_REFRESH_SECRET: string;
    private FRONTEND_ORIGIN: string;
    private isProduction: boolean;
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

    ) {
        this.JWT_REFRESH_SECRET = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
        this.FRONTEND_ORIGIN = this.configService.getOrThrow<string>('FRONTEND_ORIGIN');
        this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    }

    private getCookieOptions(maxAgeMs?: number): CookieOptions {
        return {
            httpOnly: true,
            secure: this.isProduction,
            sameSite: this.isProduction ? 'none' : 'lax',
            path: '/',
            ...(typeof maxAgeMs === 'number' ? { maxAge: maxAgeMs } : {}),
        };
    }

    @IgnoreJwtGuard()
    @Get('kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    async kakaoCallback(@Req() req: any, @Res() res: Response) {
        const { accessToken, refreshToken } = await this.authService.validateOauthLogin(req.user);

        res.cookie('accessToken', accessToken, this.getCookieOptions(1000 * 60 * 5));

        res.cookie('refreshToken', refreshToken, this.getCookieOptions(1000 * 60 * 60 * 24 * 7));

        const redirectBase = this.FRONTEND_ORIGIN.replace(/\/$/, "");
        return res.redirect(`${redirectBase}/auth/kakao/callback`);
    }

    @Post('create-admin-user')
    @UseGuards(AuthGuard('jwt'))
    @IsAdmin(true)
    @ApiOperation({ summary: '관리자 계정 생성' })
    @ApiOkResponse({ description: '관리자 계정 생성 성공' })
    async createAdminUser(
        @Req() req: any,
        @Body() adminUserDto: AuthInput.CreateAdminUserDto
    ) {
        await this.authService.createAdminUser(req.user.userId, adminUserDto);
    }

    @Post('admin-login')
    @IgnoreJwtGuard()
    @ApiOperation({ summary: '관리자 로그인' })
    @ApiOkResponse({ type: AuthResult.UserInfo, description: '로그인 성공, 쿠키에 토큰 포함' })
    async adminLogin(
        @Body() adminLoginDto: AuthInput.AdminLoginDto,
        @Res() res: Response
    ) {
        const { accessToken, refreshToken, user } = await this.authService.adminLogin(adminLoginDto);

        res.cookie('accessToken', accessToken, this.getCookieOptions(1000 * 60 * 5));

        res.cookie('refreshToken', refreshToken, this.getCookieOptions(1000 * 60 * 60 * 24 * 7));

        res.send(user);
    }

    @Post('logout')
    @ApiOperation({ summary: '로그아웃' })
    @ApiOkResponse({ schema: { properties: { message: { type: 'string', example: 'success' } } }, description: '로그아웃 성공' })
    async logout(@Res() res: Response) {
        const clearOptions = this.getCookieOptions();
        res.clearCookie('accessToken', clearOptions);
        res.clearCookie('refreshToken', clearOptions);
        res.send({ message: 'success'});
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Access Token 재발급' })
    @ApiOkResponse({ schema: { properties: { message: { type: 'string', example: 'success' } } }, description: 'Access Token 재발급 성공' })
    async refreshToken(
        @Req() req: any,
        @Res() res: Response
    ) {
        const refreshToken = req.cookies['refreshToken'];
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

            res.cookie('accessToken', newAccessToken, this.getCookieOptions(1000 * 60 * 5));

            return res.status(200).send({ message: 'success' });
        } catch (e) {
            throw new UnauthorizedException('refreshToken이 만료되었거나 유효하지 않습니다.');
        }
    }
}
