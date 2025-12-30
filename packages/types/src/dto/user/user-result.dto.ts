import { ApiProperty } from "@nestjs/swagger";

export namespace UserResult {
    export class UserInfo {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'user@example.com' })
        email: string;
        @ApiProperty({ type: String, example: 'ppopgi' })
        nickname: string;
        @ApiProperty({ type: String, example: 'https://example.com/profile.jpg' })
        profileImage: string;
        @ApiProperty({ type: Boolean, example: false })
        isAdmin: boolean;

        constructor(user: any) {
            this.id = user.id;
            this.email = user.email;
            this.nickname = user.nickname;
            this.profileImage = user.profileImage;
            this.isAdmin = user.isAdmin;
        }
    }
}
