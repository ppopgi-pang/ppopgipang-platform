import { UserResult } from "../user/user-result.dto";


export namespace TradeChatResult {
    export class TradeChatRoomDto {
        id: number;
        sellerId: number;
        buyerId: number;
        tradeId: number;
        createdAt: Date;

        constructor(chatRoom: any) {
            this.id = chatRoom.id;
            this.sellerId = chatRoom.sellerId;
            this.buyerId = chatRoom.buyerId;
            this.tradeId = chatRoom.tradePost ? chatRoom.tradePost.id : chatRoom.tradeId;
            this.createdAt = chatRoom.createdAt;
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

    export class TradeChatMessageListDto {
        list: TradeChatMessageDto[];
        count: number;

        constructor(list: TradeChatMessageDto[], count: number) {
            this.list = list;
            this.count = count;
        }
    }
}


