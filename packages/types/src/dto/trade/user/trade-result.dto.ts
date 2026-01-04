import { UserResult } from "../../user/user-result.dto";
import { ApiProperty } from "@nestjs/swagger";

export namespace TradeResult {
    export class TradeDetailDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Title' })
        title: string;
        @ApiProperty({ type: String, example: 'Sample description' })
        description: string;
        @ApiProperty({ type: [String], example: ['https://example.com/image.jpg'] })
        images: string[];
        @ApiProperty({ type: Number, example: 10000 })
        price: number;
        @ApiProperty({ type: String, enum: ['sale', 'exchange'], example: 'sale' })
        type: 'sale' | 'exchange';
        @ApiProperty({ type: String, enum: ['active', 'completed', 'cancelled'], example: 'active' })
        status: 'active' | 'completed' | 'cancelled';
        @ApiProperty({ type: () => UserResult.UserInfo, example: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'https://example.com/profile.jpg', isAdmin: false } })
        user: UserResult.UserInfo;
        @ApiProperty({ type: Boolean, example: true })
        chatRoomExists: boolean;
        @ApiProperty({ type: Number, example: 1, nullable: true })
        chatRoomId: number | null;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        updatedAt: Date;

        constructor(trade: any, chatRoom?: { exists: boolean; id: number | null }) {
            this.id = trade.id;
            this.title = trade.title;
            this.description = trade.description;
            this.images = trade.images;
            this.price = trade.price;
            this.type = trade.type;
            this.status = trade.status;
            this.user = new UserResult.UserInfo(trade.user);
            this.chatRoomExists = chatRoom?.exists ?? false;
            this.chatRoomId = chatRoom?.id ?? null;
            this.createdAt = trade.createdAt;
            this.updatedAt = trade.updatedAt;
        }
    }

    export class TradeSummaryDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Title' })
        title: string;
        @ApiProperty({ type: [String], example: ['https://example.com/image.jpg'] })
        images: string[];
        @ApiProperty({ type: Number, example: 10000 })
        price: number;
        @ApiProperty({ type: String, enum: ['sale', 'exchange'], example: 'sale' })
        type: 'sale' | 'exchange';
        @ApiProperty({ type: String, enum: ['active', 'completed', 'cancelled'], example: 'active' })
        status: 'active' | 'completed' | 'cancelled';
        @ApiProperty({ type: () => UserResult.UserInfo, example: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'https://example.com/profile.jpg', isAdmin: false } })
        user: UserResult.UserInfo;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        updatedAt: Date;

        constructor(trade: any) {
            this.id = trade.id;
            this.title = trade.title;
            this.images = trade.images;
            this.price = trade.price;
            this.type = trade.type;
            this.status = trade.status;
            this.user = new UserResult.UserInfo(trade.user);
            this.createdAt = trade.createdAt;
            this.updatedAt = trade.updatedAt;
        }
    }

    export class SearchDto {
        @ApiProperty({ type: Boolean, example: true })
        success: boolean;
        @ApiProperty({ type: () => [TradeSummaryDto], example: [{ id: 1, title: 'Sample Title', images: ['image.jpg'], price: 10000, type: 'sale', status: 'active', user: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'https://example.com/profile.jpg', isAdmin: false }, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }] })
        data: TradeSummaryDto[];
        @ApiProperty({ type: Object, example: { count: 3 } })
        metadata: {
            count: number;
        };

        constructor(success: boolean, data: TradeSummaryDto[], metadata: { count: number }) {
            this.success = success;
            this.data = data;
            this.metadata = metadata;
        }
    }
}
