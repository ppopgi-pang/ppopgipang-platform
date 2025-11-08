import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            clientID: configService.getOrThrow<string>('KAKAO_CLIENT_ID'),
            callbackURL: configService.getOrThrow<string>('KAKAO_REDIRECT_URI'),
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        try {
            const kakaoAccount = profile._json.kakao_account;
            const user = {
                provider: 'kakao',
                kakaoId: profile.id,
                email: kakaoAccount?.email,
                nickname: kakaoAccount?.profile?.nickname,
                profileImage: kakaoAccount?.profile?.profile_image_url,
            };
            done(null, user);
        } catch (e) {
            done(e, false);
        }
    }
}