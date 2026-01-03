import { UserResult } from "../user/user-result.dto";
import { ApiProperty } from "@nestjs/swagger";


export namespace TradeChatResult {
    export class TradeSimpleDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Title' })
        title: string;
        @ApiProperty({ type: String, example: 'Sample description' })
        description: string;
        @ApiProperty({ type: String, example: 'image.jpg', nullable: true })
        image: string | null;
        @ApiProperty({ type: Number, example: 10000 })
        price: number;
        @ApiProperty({ type: String, enum: ['sale', 'exchange'], example: 'sale' })
        type: 'sale' | 'exchange';
        @ApiProperty({ type: String, enum: ['active', 'completed', 'cancelled'], example: 'active' })
        status: 'active' | 'completed' | 'cancelled';

        constructor(trade: any) {
            this.id = trade.id;
            this.title = trade.title;
            this.description = trade.description;
            this.image = trade.images ? trade.images[0] : null;
            this.price = trade.price;
            this.type = trade.type;
            this.status = trade.status;
        }
    }

    export class TradeChatRoomDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: Number, example: 1 })
        sellerId: number;
        @ApiProperty({ type: Number, example: 1 })
        buyerId: number;
        @ApiProperty({ type: Number, example: 1 })
        tradeId: number;
        @ApiProperty({ type: () => TradeSimpleDto, example: { id: 1, title: 'Sample Title', description: 'Sample description', image: 'image.jpg', price: 10000, type: 'sale', status: 'active' } })
        trade: TradeSimpleDto;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;
        @ApiProperty({ type: () => UserResult.UserInfo, example: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false } })
        seller: UserResult.UserInfo;
        @ApiProperty({ type: () => UserResult.UserInfo, example: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false } })
        buyer: UserResult.UserInfo;

        constructor(chatRoom: any, users: { seller: any; buyer: any }) {
            const tradePost = chatRoom.tradePost || chatRoom.trade;

            this.id = chatRoom.id;
            this.sellerId = chatRoom.sellerId;
            this.buyerId = chatRoom.buyerId;
            this.tradeId = tradePost ? tradePost.id : chatRoom.tradeId;
            this.trade = tradePost ? new TradeSimpleDto(tradePost) : null as any; // Trade info is required now
            this.createdAt = chatRoom.createdAt;
            const seller = users?.seller ?? chatRoom.seller;
            const buyer = users?.buyer ?? chatRoom.buyer;
            this.seller = new UserResult.UserInfo(seller);
            this.buyer = new UserResult.UserInfo(buyer)
        }
    }

    export class TradeChatMessageDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: () => UserResult.UserInfo, example: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false } })
        sender: UserResult.UserInfo;
        @ApiProperty({ type: String, example: 'success' })
        message: string;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        sentAt: Date;
        @ApiProperty({ type: Number, example: 1 })
        roomId: number;

        constructor(message: any) {
            this.id = message.id;
            this.sender = new UserResult.UserInfo(message.sender);
            this.message = message.message;
            this.sentAt = message.sentAt;
            this.roomId = message.room ? message.room.id : message.roomId;
        }
    }

    export class TradeChatRoomWithLastMessageDto {
        @ApiProperty({ type: () => TradeChatRoomDto, example: { id: 1, sellerId: 1, buyerId: 1, tradeId: 1, trade: { id: 1, title: 'Sample Title', description: 'Sample description', image: 'image.jpg', price: 10000, type: 'sale', status: 'active' }, createdAt: '2024-01-01T00:00:00.000Z', seller: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false }, buyer: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false } } })
        room: TradeChatRoomDto;
        @ApiProperty({ type: () => TradeChatMessageDto, example: { id: 1, sender: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false }, message: 'success', sentAt: '2024-01-01T00:00:00.000Z', roomId: 1 }, nullable: true })
        lastMessage: TradeChatMessageDto | null;

        constructor(room: TradeChatRoomDto, lastMessage: TradeChatMessageDto | null) {
            this.room = room;
            this.lastMessage = lastMessage;
        }
    }

    export class TradeChatRoomListDto {
        @ApiProperty({ type: () => [TradeChatRoomWithLastMessageDto], example: [{ room: { id: 1, sellerId: 1, buyerId: 1, tradeId: 1, trade: { id: 1, title: 'Sample Title', description: 'Sample description', image: 'image.jpg', price: 10000, type: 'sale', status: 'active' }, createdAt: '2024-01-01T00:00:00.000Z', seller: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false }, buyer: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false } }, lastMessage: { id: 1, sender: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false }, message: 'success', sentAt: '2024-01-01T00:00:00.000Z', roomId: 1 } }] })
        list: TradeChatRoomWithLastMessageDto[];
        @ApiProperty({ type: Number, example: 3 })
        count: number;

        constructor(list: TradeChatRoomWithLastMessageDto[], count: number) {
            this.list = list;
            this.count = count;
        }
    }

    export class TradeChatMessageListDto {
        @ApiProperty({ type: () => [TradeChatMessageDto], example: [{ id: 1, sender: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false }, message: 'success', sentAt: '2024-01-01T00:00:00.000Z', roomId: 1 }] })
        list: TradeChatMessageDto[];
        @ApiProperty({ type: Number, example: 3 })
        count: number;
        @ApiProperty({ type: () => TradeChatRoomDto, example: { id: 1, sellerId: 1, buyerId: 1, tradeId: 1, trade: { id: 1, title: 'Sample Title', description: 'Sample description', image: 'image.jpg', price: 10000, type: 'sale', status: 'active' }, createdAt: '2024-01-01T00:00:00.000Z', seller: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false }, buyer: { id: 1, email: 'user@example.com', nickname: 'ppopgi', profileImage: 'profile.jpg', isAdmin: false } }, required: false })
        room?: TradeChatRoomDto;

        constructor(list: TradeChatMessageDto[], count: number, room?: TradeChatRoomDto) {
            this.list = list;
            this.count = count;
            this.room = room;
        }
    }
}

