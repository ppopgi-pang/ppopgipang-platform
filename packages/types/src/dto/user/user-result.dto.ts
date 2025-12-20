export namespace UserResult {
    export class UserInfo {
        id: number;
        email: string;
        nickname: string;
        profileImage: string;

        constructor(user: any) {
            this.id = user.id;
            this.email = user.email;
            this.nickname = user.nickname;
            this.profileImage = user.profileImage;
        }
    }
}