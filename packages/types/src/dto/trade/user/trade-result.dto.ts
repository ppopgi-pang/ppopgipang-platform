import { UserResult } from "../../user/user-result.dto";

export namespace TradeResult {
    export class TradeDetailDto {
        id: number;
        title: string;
        description: string;
        images: string[];
        price: number;
        type: 'sale' | 'exchange';
        status: 'active' | 'completed' | 'cancelled';
        user: UserResult.UserInfo;
        createdAt: Date;
        updatedAt: Date;

        constructor(trade: any) {
            this.id = trade.id;
            this.title = trade.title;
            this.description = trade.description;
            this.images = trade.images;
            this.price = trade.price;
            this.type = trade.type;
            this.status = trade.status;
            this.user = new UserResult.UserInfo(trade.user);
            this.createdAt = trade.createdAt;
            this.updatedAt = trade.updatedAt;
        }
    }

    export class TradeSummaryDto {
        id: number;
        title: string;
        images: string[];
        price: number;
        type: 'sale' | 'exchange';
        status: 'active' | 'completed' | 'cancelled';
        user: UserResult.UserInfo;
        createdAt: Date;
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
        success: boolean;
        data: TradeSummaryDto[];
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
