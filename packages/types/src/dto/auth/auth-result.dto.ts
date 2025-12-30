import { ApiProperty } from "@nestjs/swagger";

export namespace AuthResult {

    export class UserInfo {
        @ApiProperty({ type: String, example: 'user@example.com' })
        email: string;
        @ApiProperty({ type: String, example: 'ppopgi' })
        username: string;
        @ApiProperty({ type: String, example: 'https://example.com/profile.jpg' })
        profileImage: string;
        constructor(user: any) {
            this.email = user.email;
            this.username = user.nickname;
            this.profileImage = user.profileImage;
        }
    }
    export class LoginDto {
        @ApiProperty({ type: String, example: 'access-token' })
        accessToken: string;
        @ApiProperty({ type: String, example: 'refresh-token' })
        refreshToken: string;
        @ApiProperty({ type: () => UserInfo, example: { email: 'user@example.com', username: 'ppopgi', profileImage: 'https://example.com/profile.jpg' } })
        user: UserInfo;

        constructor(accessToken: string, refreshToken: string, user: any) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.user = new UserInfo(user);
        }
    }
}
