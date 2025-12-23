import { AuthResult } from "src/dto/auth/auth-result.dto";

export namespace ReviewResult {
    export class StoreInfoDto {
        id: number;
        name: string;
        address: string;

        constructor(id: number, name: string, address: string) {
            this.id = id;
            this.name = name;
            this.address = address;
        }
    }

    export class ReviewDto {
        id: number;
        rating: number;
        content: string;
        images: string[];
        user: AuthResult.UserInfo;
        store: StoreInfoDto;
        createdAt: Date;
        updatedAt: Date;

        constructor(
            id: number,
            rating: number,
            content: string,
            images: string[],
            user: AuthResult.UserInfo,
            store: StoreInfoDto,
            createdAt: Date,
            updatedAt: Date
        ) {
            this.id = id;
            this.rating = rating;
            this.content = content;
            this.images = images;
            this.user = user;
            this.store = store;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
    }

    export class GetMyReviewsResultDto {
        list: ReviewDto[];
        total: number;

        constructor(list: ReviewDto[], total: number) {
            this.list = list;
            this.total = total;
        }
    }
}