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
        isVisited?: boolean;
        thumbnailUrl?: string | null;
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

    export class StampDto {
        id: number;
        imageName: string;
        acquiredAt: Date;

        constructor(id: number, imageName: string, acquiredAt: Date) {
            this.id = id;
            this.imageName = imageName;
            this.acquiredAt = acquiredAt;
        }
    }

    export class MyStoreStatusDto {
        visitCount: number;
        lootCount: number;
        isScrapped: boolean;
        tier: 'unknown' | 'visited' | 'master';
        stamps: StampDto[];

        constructor(visitCount: number, lootCount: number, isScrapped: boolean, tier: 'unknown' | 'visited' | 'master', stamps: StampDto[]) {
            this.visitCount = visitCount;
            this.lootCount = lootCount;
            this.isScrapped = isScrapped;
            this.tier = tier;
            this.stamps = stamps;
        }
    }

    export class RecentLootDto {
        id: number;
        photoUrl: string;
        createdAt: Date;
        userName: string;

        constructor(id: number, photoUrl: string, createdAt: Date, userName: string) {
            this.id = id;
            this.photoUrl = photoUrl;
            this.createdAt = createdAt;
            this.userName = userName;
        }
    }

    export class StoreSummaryExtendedDto {
        store: {
            id: number;
            name: string;
            address: string;
            category?: string | null;
            latitude: number;
            longitude: number;
            distance?: number;
            thumbnailUrl?: string | null;
        };
        businessStatus: 'open' | 'closed' | 'unknown';
        myStatus: MyStoreStatusDto;
        recentLoots: RecentLootDto[];

        constructor(
            store: { id: number; name: string; address: string; category?: string | null; latitude: number; longitude: number; distance?: number; thumbnailUrl?: string | null },
            businessStatus: 'open' | 'closed' | 'unknown',
            myStatus: MyStoreStatusDto,
            recentLoots: RecentLootDto[]
        ) {
            this.store = store;
            this.businessStatus = businessStatus;
            this.myStatus = myStatus;
            this.recentLoots = recentLoots;
        }
    }
}

