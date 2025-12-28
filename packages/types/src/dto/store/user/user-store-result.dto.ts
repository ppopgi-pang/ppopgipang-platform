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
        successProb?: number; // AI 득템 지수 (0-100)
        successLevel?: string; // '매우 높음', '높음', '보통', '낮음', '매우 낮음'
        myRanking?: number; // 나의 랭킹 (해당 가게 방문자 중)

        constructor(
            store: { id: number; name: string; address: string; category?: string | null; latitude: number; longitude: number; distance?: number; thumbnailUrl?: string | null },
            businessStatus: 'open' | 'closed' | 'unknown',
            myStatus: MyStoreStatusDto,
            recentLoots: RecentLootDto[],
            successProb?: number,
            successLevel?: string,
            myRanking?: number
        ) {
            this.store = store;
            this.businessStatus = businessStatus;
            this.myStatus = myStatus;
            this.recentLoots = recentLoots;
            this.successProb = successProb;
            this.successLevel = successLevel;
            this.myRanking = myRanking;
        }
    }

    // ===== 새로운 DTO: Store Detail Extended =====

    export class HotTimeSlotDto {
        hour: number; // 0-23
        probability: number; // 0-100

        constructor(hour: number, probability: number) {
            this.hour = hour;
            this.probability = probability;
        }
    }

    export class StoreAnalyticsDto {
        successProb: number;
        successLevel: string;
        recentLootCount: number;
        hotTimeData: HotTimeSlotDto[];
        bestTimeMessage: string;

        constructor(
            successProb: number,
            successLevel: string,
            recentLootCount: number,
            hotTimeData: HotTimeSlotDto[],
            bestTimeMessage: string
        ) {
            this.successProb = successProb;
            this.successLevel = successLevel;
            this.recentLootCount = recentLootCount;
            this.hotTimeData = hotTimeData;
            this.bestTimeMessage = bestTimeMessage;
        }
    }

    export class QuestInfoDto {
        achievementId: number;
        achievementCode: string;
        name: string;
        description: string;
        badgeImageName: string | null;
        condition: string;
        progress?: number;
        isCompleted?: boolean;

        constructor(
            achievementId: number,
            achievementCode: string,
            name: string,
            description: string,
            badgeImageName: string | null,
            condition: string,
            progress?: number,
            isCompleted?: boolean
        ) {
            this.achievementId = achievementId;
            this.achievementCode = achievementCode;
            this.name = name;
            this.description = description;
            this.badgeImageName = badgeImageName;
            this.condition = condition;
            this.progress = progress;
            this.isCompleted = isCompleted;
        }
    }

    export class StoreFacilitiesDto {
        machineCount: number | null;
        paymentMethods: string[];
        notes: string | null;

        constructor(
            machineCount: number | null,
            paymentMethods: string[],
            notes: string | null
        ) {
            this.machineCount = machineCount;
            this.paymentMethods = paymentMethods;
            this.notes = notes;
        }
    }

    export class OpeningHoursDto {
        dayOfWeek: number;
        dayName: string;
        openTime: string;
        closeTime: string;
        isClosed: boolean;

        constructor(
            dayOfWeek: number,
            dayName: string,
            openTime: string,
            closeTime: string,
            isClosed: boolean
        ) {
            this.dayOfWeek = dayOfWeek;
            this.dayName = dayName;
            this.openTime = openTime;
            this.closeTime = closeTime;
            this.isClosed = isClosed;
        }
    }

    export class StorePhotoDto {
        id: number;
        type: string;
        imageUrl: string;

        constructor(id: number, type: string, imageUrl: string) {
            this.id = id;
            this.type = type;
            this.imageUrl = imageUrl;
        }
    }

    export class StoreDetailExtendedDto {
        store: {
            id: number;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            phone: string | null;
            category: string | null;
            region1: string | null;
            region2: string | null;
        };
        analytics: StoreAnalyticsDto | null;
        availableQuests: QuestInfoDto[];
        facilities: StoreFacilitiesDto | null;
        openingHours: OpeningHoursDto[];
        businessStatus: 'open' | 'closed' | 'unknown';
        photos: StorePhotoDto[];
        recentReviews: ReviewResult.ReviewDto[];
        myStatus?: MyStoreStatusDto;

        constructor(
            store: {
                id: number;
                name: string;
                address: string;
                latitude: number;
                longitude: number;
                phone: string | null;
                category: string | null;
                region1: string | null;
                region2: string | null;
            },
            analytics: StoreAnalyticsDto | null,
            availableQuests: QuestInfoDto[],
            facilities: StoreFacilitiesDto | null,
            openingHours: OpeningHoursDto[],
            businessStatus: 'open' | 'closed' | 'unknown',
            photos: StorePhotoDto[],
            recentReviews: ReviewResult.ReviewDto[],
            myStatus?: MyStoreStatusDto
        ) {
            this.store = store;
            this.analytics = analytics;
            this.availableQuests = availableQuests;
            this.facilities = facilities;
            this.openingHours = openingHours;
            this.businessStatus = businessStatus;
            this.photos = photos;
            this.recentReviews = recentReviews;
            this.myStatus = myStatus;
        }
    }

    export class StoreGalleryItemDto {
        certificationId: number;
        photoUrl: string;
        occurredAt: Date;
        userName: string;
        userProfileImage: string | null;
        likeCount: number;

        constructor(
            certificationId: number,
            photoUrl: string,
            occurredAt: Date,
            userName: string,
            userProfileImage: string | null,
            likeCount: number
        ) {
            this.certificationId = certificationId;
            this.photoUrl = photoUrl;
            this.occurredAt = occurredAt;
            this.userName = userName;
            this.userProfileImage = userProfileImage;
            this.likeCount = likeCount;
        }
    }

    export class StoreGalleryDto {
        success: boolean;
        data: StoreGalleryItemDto[];
        meta: {
            page: number;
            size: number;
            total: number;
        };

        constructor(
            success: boolean,
            data: StoreGalleryItemDto[],
            meta: { page: number; size: number; total: number }
        ) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }
}

