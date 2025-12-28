import { ReviewResult } from "src/dto/review/user/review-result.dto";

export namespace UserStoreResult {
    export class StoreDto {
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        phone?: string | null;
        averageRating?: number;
        distance?: number;
        type?: {
            id: number;
            name: string;
            description?: string | null;
        };

        constructor(id: number, name: string, address: string, latitude: number, longitude: number, phone?: string | null) {
            this.id = id;
            this.name = name;
            this.address = address;
            this.latitude = latitude;
            this.longitude = longitude;
            this.phone = phone;
        }
    }
    export class InBoundSearchDto {
        success: boolean;
        data: StoreDto[];
        meta: { count: number };
        constructor(success: boolean, data: StoreDto[], meta: { count: number }) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class FindNearByDto {
        success: boolean;
        data: StoreDto[];
        meta: { count: number };

        constructor(success: boolean, data: StoreDto[], meta: { count: number }) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class SearchDto {
        success: boolean;
        data: StoreDto[];
        meta: { count: number };

        constructor(success: boolean, data: StoreDto[], meta: { count: number }) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class StoreDetailDto {
        reviews: ReviewResult.ReviewDto[];
        store: StoreDto;

        constructor(reviews: ReviewResult.ReviewDto[], store: StoreDto) {
            this.reviews = reviews;
            this.store = store;
        }
    }

    export class StoreSummaryDto {
        id: number;
        name: string;
        address: string;
        thumbnailUrl: string | null;
        rating: number;
        isScrapped: boolean;

        constructor(id: number, name: string, address: string, thumbnailUrl: string | null, rating: number, isScrapped: boolean) {
            this.id = id;
            this.name = name;
            this.address = address;
            this.thumbnailUrl = thumbnailUrl;
            this.rating = rating;
            this.isScrapped = isScrapped;
        }
    }
}

