import { AuthResult } from "../../auth/auth-result.dto";
import { ApiProperty } from "@nestjs/swagger";

export namespace ReviewResult {
    export class StoreInfoDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Seoul, Korea' })
        address: string;

        constructor(id: number, name: string, address: string) {
            this.id = id;
            this.name = name;
            this.address = address;
        }
    }

    export class ReviewDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: Number, example: 4.5 })
        rating: number;
        @ApiProperty({ type: String, example: 'Sample content' })
        content: string;
        @ApiProperty({ type: [String], example: ['https://example.com/image.jpg'] })
        images: string[];
        @ApiProperty({ type: () => AuthResult.UserInfo, example: { email: 'user@example.com', username: 'ppopgi', profileImage: 'https://example.com/profile.jpg' } })
        user: AuthResult.UserInfo;
        @ApiProperty({ type: () => StoreInfoDto, example: { id: 1, name: 'Sample Name', address: 'Seoul, Korea' } })
        store: StoreInfoDto;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
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
        @ApiProperty({ type: () => [ReviewDto], example: [{ id: 1, rating: 4.5, content: 'Sample content', images: ['https://example.com/image.jpg'], user: { email: 'user@example.com', username: 'ppopgi', profileImage: 'https://example.com/profile.jpg' }, store: { id: 1, name: 'Sample Name', address: 'Seoul, Korea' }, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }] })
        list: ReviewDto[];
        @ApiProperty({ type: Number, example: 20 })
        total: number;

        constructor(list: ReviewDto[], total: number) {
            this.list = list;
            this.total = total;
        }
    }

    export class ReviewStatsDto {
        @ApiProperty({ type: Number, example: 4.2 })
        averageRating: number;
        @ApiProperty({ type: Object, example: { '1': 5 } })
        ratingDistribution: { [key: number]: number }; // 1: count, 2: count ...

        constructor(averageRating: number, ratingDistribution: { [key: number]: number }) {
            this.averageRating = averageRating;
            this.ratingDistribution = ratingDistribution;
        }
    }
}
