export namespace AuthResult {

    export class UserInfo {
        email: string;
        username: string;
        profileImage: string;
        constructor(user: any) {
            this.email = user.email;
            this.username = user.nickname;
            this.profileImage = user.profileImage;
        }
    }
    export class LoginDto {
        accessToken: string;
        refreshToken: string;
        user: UserInfo;

        constructor(accessToken: string, refreshToken: string, user: any) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.user = new UserInfo(user);
        }
    }
}