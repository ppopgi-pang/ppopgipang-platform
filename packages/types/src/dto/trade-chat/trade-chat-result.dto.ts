import { UserResult } from "../user/user-result.dto";


export namespace TradeChatResult {
    export class TradeSimpleDto {
        id: number;
        title: string;
        description: string;
        image: string | null;
        price: number;
        type: 'sale' | 'exchange';
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
        id: number;
        sellerId: number;
        buyerId: number;
        tradeId: number;
        trade: TradeSimpleDto;
        createdAt: Date;
        seller: UserResult.UserInfo;
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
        id: number;
        sender: UserResult.UserInfo;
        message: string;
        sentAt: Date;
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
        room: TradeChatRoomDto;
        lastMessage: TradeChatMessageDto | null;

        constructor(room: TradeChatRoomDto, lastMessage: TradeChatMessageDto | null) {
            this.room = room;
            this.lastMessage = lastMessage;
        }
    }

    export class TradeChatRoomListDto {
        list: TradeChatRoomWithLastMessageDto[];
        count: number;

        constructor(list: TradeChatRoomWithLastMessageDto[], count: number) {
            this.list = list;
            this.count = count;
        }
    }

    export class TradeChatMessageListDto {
        list: TradeChatMessageDto[];
        count: number;
        room?: TradeChatRoomDto;

        constructor(list: TradeChatMessageDto[], count: number, room?: TradeChatRoomDto) {
            this.list = list;
            this.count = count;
            this.room = room;
        }
    }
}

