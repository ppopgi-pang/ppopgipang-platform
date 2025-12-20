import { ReviewResult } from "src/dto/review/user/review-result.dto";

export namespace UserStoreResult {
    export class StoreDto {
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        phone: string;

        constructor(id: number, name: string, address: string, latitude: number, longitude: number, phone: string) {
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
        data: object[];
        meta: object;
        constructor(success: boolean, data: object[], meta: object) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class FindNearByDto {
        success: boolean;
        data: object[];
        meta: object;

        constructor(success: boolean, data: object[], meta: object) {
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
}