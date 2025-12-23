import { UserResult } from "../user/user-result.dto";


export namespace TradeChatResult {
    export class TradeChatRoomDto {
        id: number;
        sellerId: number;
        buyerId: number;
        tradeId: number;
        createdAt: Date;
        seller?: UserResult.UserInfo;
        buyer?: UserResult.UserInfo;

        constructor(chatRoom: any, users?: { seller?: any; buyer?: any }) {
            this.id = chatRoom.id;
            this.sellerId = chatRoom.sellerId;
            this.buyerId = chatRoom.buyerId;
            this.tradeId = chatRoom.tradePost ? chatRoom.tradePost.id : chatRoom.tradeId;
            this.createdAt = chatRoom.createdAt;
            const seller = users?.seller ?? chatRoom.seller;
            const buyer = users?.buyer ?? chatRoom.buyer;
            this.seller = seller ? new UserResult.UserInfo(seller) : undefined;
            this.buyer = buyer ? new UserResult.UserInfo(buyer) : undefined;
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

