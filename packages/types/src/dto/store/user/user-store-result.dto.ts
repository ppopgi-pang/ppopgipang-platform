import { ReviewResult } from "../../review/user/review-result.dto";
import { ApiProperty } from "@nestjs/swagger";

export namespace UserStoreResult {
    export class StoreDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Seoul, Korea' })
        address: string;
        @ApiProperty({ type: Number, example: 37.5665 })
        latitude: number;
        @ApiProperty({ type: Number, example: 126.978 })
        longitude: number;
        @ApiProperty({ type: String, example: '010-1234-5678', required: false, nullable: true })
        phone?: string | null;
        @ApiProperty({ type: Number, example: 4.2, required: false })
        averageRating?: number;
        @ApiProperty({ type: Number, example: 120, required: false })
        distance?: number;
        @ApiProperty({ type: Boolean, example: true, required: false })
        isVisited?: boolean;
        @ApiProperty({ type: String, example: 'https://example.com/thumbnail.jpg', required: false, nullable: true })
        thumbnailUrl?: string | null;
        @ApiProperty({ type: Object, example: { id: 1, name: 'Sample Name', description: 'Sample description' }, required: false })
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
        @ApiProperty({ type: Boolean, example: true })
        success: boolean;
        @ApiProperty({ type: () => [StoreDto], example: [{ id: 1, name: 'Sample Name', address: 'Seoul, Korea', latitude: 37.5665, longitude: 126.978, phone: '010-1234-5678', averageRating: 4.2, distance: 120, isVisited: true, thumbnailUrl: 'https://example.com/thumbnail.jpg', type: { id: 1, name: 'Sample Name', description: 'Sample description' } }] })
        data: StoreDto[];
        @ApiProperty({ type: Object, example: { count: 3 } })
        meta: { count: number };
        constructor(success: boolean, data: StoreDto[], meta: { count: number }) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class FindNearByDto {
        @ApiProperty({ type: Boolean, example: true })
        success: boolean;
        @ApiProperty({ type: () => [StoreDto], example: [{ id: 1, name: 'Sample Name', address: 'Seoul, Korea', latitude: 37.5665, longitude: 126.978, phone: '010-1234-5678', averageRating: 4.2, distance: 120, isVisited: true, thumbnailUrl: 'https://example.com/thumbnail.jpg', type: { id: 1, name: 'Sample Name', description: 'Sample description' } }] })
        data: StoreDto[];
        @ApiProperty({ type: Object, example: { count: 3 } })
        meta: { count: number };

        constructor(success: boolean, data: StoreDto[], meta: { count: number }) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class SearchDto {
        @ApiProperty({ type: Boolean, example: true })
        success: boolean;
        @ApiProperty({ type: () => [StoreDto], example: [{ id: 1, name: 'Sample Name', address: 'Seoul, Korea', latitude: 37.5665, longitude: 126.978, phone: '010-1234-5678', averageRating: 4.2, distance: 120, isVisited: true, thumbnailUrl: 'https://example.com/thumbnail.jpg', type: { id: 1, name: 'Sample Name', description: 'Sample description' } }] })
        data: StoreDto[];
        @ApiProperty({ type: Object, example: { count: 3 } })
        meta: { count: number };

        constructor(success: boolean, data: StoreDto[], meta: { count: number }) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class StoreDetailDto {
        @ApiProperty({ type: () => [ReviewResult.ReviewDto], example: [{ id: 1, rating: 4.5, content: 'Sample content', images: ['https://example.com/image.jpg'], user: { email: 'user@example.com', username: 'ppopgi', profileImage: 'https://example.com/profile.jpg' }, store: { id: 1, name: 'Sample Name', address: 'Seoul, Korea' }, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }] })
        reviews: ReviewResult.ReviewDto[];
        @ApiProperty({ type: () => StoreDto, example: { id: 1, name: 'Sample Name', address: 'Seoul, Korea', latitude: 37.5665, longitude: 126.978, phone: '010-1234-5678', averageRating: 4.2, distance: 120, isVisited: true, thumbnailUrl: 'https://example.com/thumbnail.jpg', type: { id: 1, name: 'Sample Name', description: 'Sample description' } } })
        store: StoreDto;

        constructor(reviews: ReviewResult.ReviewDto[], store: StoreDto) {
            this.reviews = reviews;
            this.store = store;
        }
    }

    export class StoreSummaryDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Seoul, Korea' })
        address: string;
        @ApiProperty({ type: String, example: 'https://example.com/thumbnail.jpg', nullable: true })
        thumbnailUrl: string | null;
        @ApiProperty({ type: Number, example: 4.5 })
        rating: number;
        @ApiProperty({ type: Boolean, example: true })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'image.jpg' })
        imageName: string;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        acquiredAt: Date;

        constructor(id: number, imageName: string, acquiredAt: Date) {
            this.id = id;
            this.imageName = imageName;
            this.acquiredAt = acquiredAt;
        }
    }

    export class MyStoreStatusDto {
        @ApiProperty({ type: Number, example: 12 })
        visitCount: number;
        @ApiProperty({ type: Number, example: 5 })
        lootCount: number;
        @ApiProperty({ type: Boolean, example: true })
        isScrapped: boolean;
        @ApiProperty({ type: String, enum: ['unknown', 'visited', 'master'], example: 'unknown' })
        tier: 'unknown' | 'visited' | 'master';
        @ApiProperty({ type: () => [StampDto], example: [{ id: 1, imageName: 'image.jpg', acquiredAt: '2024-01-01T00:00:00.000Z' }] })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'https://example.com/image.jpg' })
        photoUrl: string;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;
        @ApiProperty({ type: String, example: 'ppopgi' })
        userName: string;

        constructor(id: number, photoUrl: string, createdAt: Date, userName: string) {
            this.id = id;
            this.photoUrl = photoUrl;
            this.createdAt = createdAt;
            this.userName = userName;
        }
    }

    export class StoreSummaryExtendedDto {
        @ApiProperty({ type: Object, example: { id: 1, name: 'Sample Name', address: 'Seoul, Korea', category: 'arcade', latitude: 37.5665, longitude: 126.978, distance: 120, thumbnailUrl: 'https://example.com/thumbnail.jpg' } })
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
        @ApiProperty({ type: String, enum: ['open', 'closed', 'unknown'], example: 'open' })
        businessStatus: 'open' | 'closed' | 'unknown';
        @ApiProperty({ type: () => MyStoreStatusDto, example: { visitCount: 12, lootCount: 5, isScrapped: true, tier: 'unknown', stamps: [{ id: 1, imageName: 'image.jpg', acquiredAt: '2024-01-01T00:00:00.000Z' }] } })
        myStatus: MyStoreStatusDto;
        @ApiProperty({ type: () => [RecentLootDto], example: [{ id: 1, photoUrl: 'https://example.com/image.jpg', createdAt: '2024-01-01T00:00:00.000Z', userName: 'ppopgi' }] })
        recentLoots: RecentLootDto[];
        @ApiProperty({ type: Number, example: 78, required: false })
        successProb?: number; // AI 득템 지수 (0-100)
        @ApiProperty({ type: String, example: 'high', required: false })
        successLevel?: string; // '매우 높음', '높음', '보통', '낮음', '매우 낮음'
        @ApiProperty({ type: Number, example: 2, required: false })
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
        @ApiProperty({ type: Number, example: 14 })
        hour: number; // 0-23
        @ApiProperty({ type: Number, example: 70 })
        probability: number; // 0-100

        constructor(hour: number, probability: number) {
            this.hour = hour;
            this.probability = probability;
        }
    }

    export class StoreAnalyticsDto {
        @ApiProperty({ type: Number, example: 78 })
        successProb: number;
        @ApiProperty({ type: String, example: 'high' })
        successLevel: string;
        @ApiProperty({ type: Number, example: 5 })
        recentLootCount: number;
        @ApiProperty({ type: () => [HotTimeSlotDto], example: [{}] })
        hotTimeData: HotTimeSlotDto[];
        @ApiProperty({ type: String, example: 'success' })
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
        @ApiProperty({ type: Number, example: 1 })
        achievementId: number;
        @ApiProperty({ type: String, example: 'CODE123' })
        achievementCode: string;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Sample description' })
        description: string;
        @ApiProperty({ type: String, example: 'badge.png', nullable: true })
        badgeImageName: string | null;
        @ApiProperty({ type: String, example: 'Collect 10 stamps' })
        condition: string;
        @ApiProperty({ type: Number, example: 1, required: false })
        progress?: number;
        @ApiProperty({ type: Boolean, example: true, required: false })
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
        @ApiProperty({ type: Number, example: 3, nullable: true })
        machineCount: number | null;
        @ApiProperty({ type: [String], example: ['string'] })
        paymentMethods: string[];
        @ApiProperty({ type: String, example: 'string', nullable: true })
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
        @ApiProperty({ type: Number, example: 1 })
        dayOfWeek: number;
        @ApiProperty({ type: String, example: 'Mon' })
        dayName: string;
        @ApiProperty({ type: String, example: '09:00' })
        openTime: string;
        @ApiProperty({ type: String, example: '18:00' })
        closeTime: string;
        @ApiProperty({ type: Boolean, example: false })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'type' })
        type: string;
        @ApiProperty({ type: String, example: 'https://example.com/image.jpg' })
        imageUrl: string;

        constructor(id: number, type: string, imageUrl: string) {
            this.id = id;
            this.type = type;
            this.imageUrl = imageUrl;
        }
    }

    export class StoreDetailExtendedDto {
        @ApiProperty({ type: Object, example: { id: 1, name: 'Sample Name', address: 'Seoul, Korea', latitude: 37.5665, longitude: 126.978, phone: '010-1234-5678', category: 'arcade', region1: 'Seoul', region2: 'Seoul' } })
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
        @ApiProperty({ type: () => StoreAnalyticsDto, example: { successProb: 78, successLevel: 'high', recentLootCount: 5, hotTimeData: [{}], bestTimeMessage: 'success' }, nullable: true })
        analytics: StoreAnalyticsDto | null;
        @ApiProperty({ type: () => [QuestInfoDto], example: [{ achievementId: 1, achievementCode: 'CODE123', name: 'Sample Name', description: 'Sample description', badgeImageName: 'badge.png', condition: 'Collect 10 stamps', progress: 1, isCompleted: true }] })
        availableQuests: QuestInfoDto[];
        @ApiProperty({ type: () => StoreFacilitiesDto, example: { machineCount: 3, paymentMethods: ['string'], notes: 'string' }, nullable: true })
        facilities: StoreFacilitiesDto | null;
        @ApiProperty({ type: () => [OpeningHoursDto], example: [{ dayOfWeek: 1, dayName: 'Mon', openTime: '09:00', closeTime: '18:00', isClosed: false }] })
        openingHours: OpeningHoursDto[];
        @ApiProperty({ type: String, enum: ['open', 'closed', 'unknown'], example: 'open' })
        businessStatus: 'open' | 'closed' | 'unknown';
        @ApiProperty({ type: () => [StorePhotoDto], example: [{ id: 1, type: 'type', imageUrl: 'https://example.com/image.jpg' }] })
        photos: StorePhotoDto[];
        @ApiProperty({ type: () => [ReviewResult.ReviewDto], example: [{ id: 1, rating: 4.5, content: 'Sample content', images: ['https://example.com/image.jpg'], user: { email: 'user@example.com', username: 'ppopgi', profileImage: 'https://example.com/profile.jpg' }, store: { id: 1, name: 'Sample Name', address: 'Seoul, Korea' }, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }] })
        recentReviews: ReviewResult.ReviewDto[];
        @ApiProperty({ type: () => MyStoreStatusDto, example: { visitCount: 12, lootCount: 5, isScrapped: true, tier: 'unknown', stamps: [{ id: 1, imageName: 'image.jpg', acquiredAt: '2024-01-01T00:00:00.000Z' }] }, required: false })
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
        @ApiProperty({ type: Number, example: 1 })
        certificationId: number;
        @ApiProperty({ type: String, example: 'https://example.com/image.jpg' })
        photoUrl: string;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        occurredAt: Date;
        @ApiProperty({ type: String, example: 'ppopgi' })
        userName: string;
        @ApiProperty({ type: String, example: 'https://example.com/profile.jpg', nullable: true })
        userProfileImage: string | null;
        @ApiProperty({ type: Number, example: 3 })
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
        @ApiProperty({ type: Boolean, example: true })
        success: boolean;
        @ApiProperty({ type: () => [StoreGalleryItemDto], example: [{ certificationId: 1, photoUrl: 'https://example.com/image.jpg', occurredAt: '2024-01-01T00:00:00.000Z', userName: 'ppopgi', userProfileImage: 'https://example.com/profile.jpg', likeCount: 3 }] })
        data: StoreGalleryItemDto[];
        @ApiProperty({ type: Object, example: { page: 1, size: 10, total: 20 } })
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
