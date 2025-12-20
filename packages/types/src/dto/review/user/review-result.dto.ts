import { AuthResult } from "src/dto/auth/auth-result.dto";

export namespace ReviewResult {
    export class ReviewDto {
        id: number;
        rating: number;
        content: string;
        images: string[];
        user: AuthResult.UserInfo;
        createdAt: Date;
        updatedAt: Date;

        constructor(id: number, rating: number, content: string, images: string[], user: AuthResult.UserInfo, createdAt: Date, updatedAt: Date) {
            this.id = id;
            this.rating = rating;
            this.content = content;
            this.images = images;
            this.user = user;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
    }
}