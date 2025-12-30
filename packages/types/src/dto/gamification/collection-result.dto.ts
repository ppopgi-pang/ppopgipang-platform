import { ApiProperty } from "@nestjs/swagger";

export namespace CollectionResult {
    export class ProfileSummaryDto {
        @ApiProperty({ type: Number, example: 1 })
        userId: number;
        @ApiProperty({ type: String, example: 'ppopgi' })
        nickname: string;
        @ApiProperty({ type: String, example: 'profile.jpg', nullable: true })
        profileImage: string | null;
        @ApiProperty({ type: Number, example: 3 })
        currentLevel: number;
        @ApiProperty({ type: Number, example: 200 })
        currentExp: number;
        @ApiProperty({ type: Number, example: 100 })
        expToNextLevel: number;
        @ApiProperty({ type: Number, example: 5 })
        streakDays: number;

        constructor(
            userId: number,
            nickname: string,
            profileImage: string | null,
            currentLevel: number,
            currentExp: number,
            expToNextLevel: number,
            streakDays: number
        ) {
            this.userId = userId;
            this.nickname = nickname;
            this.profileImage = profileImage;
            this.currentLevel = currentLevel;
            this.currentExp = currentExp;
            this.expToNextLevel = expToNextLevel;
            this.streakDays = streakDays;
        }
    }

    export class StampStoreDto {
        @ApiProperty({ type: Number, example: 1 })
        storeId: number;
        @ApiProperty({ type: String, example: 'Sample Store' })
        storeName: string;
        @ApiProperty({ type: String, example: 'logo.png', nullable: true })
        logoImageName: string | null;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        lastVisitedAt: Date;
        @ApiProperty({ type: Number, example: 12 })
        visitCount: number;
        @ApiProperty({ type: String, example: 'Gangnam' })
        district: string;
        @ApiProperty({ type: String, example: 'Seoul' })
        city: string;

        constructor(
            storeId: number,
            storeName: string,
            logoImageName: string | null,
            lastVisitedAt: Date,
            visitCount: number,
            district: string,
            city: string
        ) {
            this.storeId = storeId;
            this.storeName = storeName;
            this.logoImageName = logoImageName;
            this.lastVisitedAt = lastVisitedAt;
            this.visitCount = visitCount;
            this.district = district;
            this.city = city;
        }
    }

    export class StampsDto {
        @ApiProperty({ type: Number, example: 20 })
        totalVisited: number;
        @ApiProperty({ type: () => [StampStoreDto], example: [{ storeId: 1, storeName: 'Sample Store', logoImageName: 'logo.png', lastVisitedAt: '2024-01-01T00:00:00.000Z', visitCount: 12, district: 'Gangnam', city: 'Seoul' }] })
        stores: StampStoreDto[];

        constructor(totalVisited: number, stores: StampStoreDto[]) {
            this.totalVisited = totalVisited;
            this.stores = stores;
        }
    }

    export class RegionProgressDto {
        @ApiProperty({ type: String, example: 'Seoul' })
        region: string;
        @ApiProperty({ type: Number, example: 3 })
        visitedCount: number;
        @ApiProperty({ type: Number, example: 20 })
        totalStores: number;
        @ApiProperty({ type: Number, example: 75 })
        percentage: number;

        constructor(
            region: string,
            visitedCount: number,
            totalStores: number,
            percentage: number
        ) {
            this.region = region;
            this.visitedCount = visitedCount;
            this.totalStores = totalStores;
            this.percentage = percentage;
        }
    }

    export class FavoriteStoreDto {
        @ApiProperty({ type: Number, example: 1 })
        storeId: number;
        @ApiProperty({ type: String, example: 'Sample Store' })
        storeName: string;
        @ApiProperty({ type: Number, example: 12 })
        visitCount: number;

        constructor(
            storeId: number,
            storeName: string,
            visitCount: number
        ) {
            this.storeId = storeId;
            this.storeName = storeName;
            this.visitCount = visitCount;
        }
    }

    export class StatisticsDto {
        @ApiProperty({ type: Number, example: 20 })
        totalVisits: number;
        @ApiProperty({ type: Number, example: 20 })
        totalLoots: number;
        @ApiProperty({ type: Number, example: 5 })
        consecutiveDays: number;
        @ApiProperty({ type: () => FavoriteStoreDto, example: { storeId: 1, storeName: 'Sample Store', visitCount: 12 }, nullable: true })
        favoriteStore: FavoriteStoreDto | null;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z', nullable: true })
        firstVisitDate: Date | null;

        constructor(
            totalVisits: number,
            totalLoots: number,
            consecutiveDays: number,
            favoriteStore: FavoriteStoreDto | null,
            firstVisitDate: Date | null
        ) {
            this.totalVisits = totalVisits;
            this.totalLoots = totalLoots;
            this.consecutiveDays = consecutiveDays;
            this.favoriteStore = favoriteStore;
            this.firstVisitDate = firstVisitDate;
        }
    }

    export class PassportDto {
        @ApiProperty({ type: () => ProfileSummaryDto, example: { userId: 1, nickname: 'ppopgi', profileImage: 'https://example.com/profile.jpg', currentLevel: 3, currentExp: 200, expToNextLevel: 100, streakDays: 5 } })
        profile: ProfileSummaryDto;
        @ApiProperty({ type: () => StampsDto, example: { totalVisited: 20, stores: [{ storeId: 1, storeName: 'Sample Store', logoImageName: 'logo.png', lastVisitedAt: '2024-01-01T00:00:00.000Z', visitCount: 12, district: 'Gangnam', city: 'Seoul' }] } })
        stamps: StampsDto;
        @ApiProperty({ type: () => [RegionProgressDto], example: [{ region: 'Seoul', visitedCount: 3, totalStores: 20, percentage: 75 }] })
        regionProgress: RegionProgressDto[];
        @ApiProperty({ type: () => StatisticsDto, example: { totalVisits: 20, totalLoots: 20, consecutiveDays: 5, favoriteStore: { storeId: 1, storeName: 'Sample Store', visitCount: 12 }, firstVisitDate: '2024-01-01T00:00:00.000Z' } })
        statistics: StatisticsDto;

        constructor(
            profile: ProfileSummaryDto,
            stamps: StampsDto,
            regionProgress: RegionProgressDto[],
            statistics: StatisticsDto
        ) {
            this.profile = profile;
            this.stamps = stamps;
            this.regionProgress = regionProgress;
            this.statistics = statistics;
        }
    }

    // ===== 득템 갤러리 =====
    export class LootItemDto {
        @ApiProperty({ type: Number, example: 1 })
        certificationId: number;
        @ApiProperty({ type: String, example: 'image.jpg' })
        imageName: string;
        @ApiProperty({ type: String, example: 'Sample Store' })
        storeName: string;
        @ApiProperty({ type: Number, example: 1 })
        storeId: number;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        obtainedAt: Date;
        @ApiProperty({ type: String, example: 'Sample comment', nullable: true })
        comment: string | null;
        @ApiProperty({ type: [String], example: ['string'] })
        lootTags: string[];
        @ApiProperty({ type: Boolean, example: true })
        hasTradePost: boolean;
        @ApiProperty({ type: Number, example: 1, nullable: true })
        tradePostId: number | null;

        constructor(
            certificationId: number,
            imageName: string,
            storeName: string,
            storeId: number,
            obtainedAt: Date,
            comment: string | null,
            lootTags: string[],
            hasTradePost: boolean,
            tradePostId: number | null
        ) {
            this.certificationId = certificationId;
            this.imageName = imageName;
            this.storeName = storeName;
            this.storeId = storeId;
            this.obtainedAt = obtainedAt;
            this.comment = comment;
            this.lootTags = lootTags;
            this.hasTradePost = hasTradePost;
            this.tradePostId = tradePostId;
        }
    }

    export class LootGallerySummaryDto {
        @ApiProperty({ type: Number, example: 20 })
        totalLoots: number;
        @ApiProperty({ type: Number, example: 1 })
        thisMonthLoots: number;
        @ApiProperty({ type: String, example: 'arcade', nullable: true })
        favoriteCategory: string | null;

        constructor(
            totalLoots: number,
            thisMonthLoots: number,
            favoriteCategory: string | null
        ) {
            this.totalLoots = totalLoots;
            this.thisMonthLoots = thisMonthLoots;
            this.favoriteCategory = favoriteCategory;
        }
    }

    export class LootGalleryDto {
        @ApiProperty({ type: () => [LootItemDto], example: [{ certificationId: 1, imageName: 'image.jpg', storeName: 'Sample Store', storeId: 1, obtainedAt: '2024-01-01T00:00:00.000Z', comment: 'Sample comment', lootTags: ['string'], hasTradePost: true, tradePostId: 1 }] })
        loots: LootItemDto[];
        @ApiProperty({ type: Object, example: { currentPage: 1, totalPages: 20, totalItems: 20, itemsPerPage: 1 } })
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
        @ApiProperty({ type: () => LootGallerySummaryDto, example: { totalLoots: 20, thisMonthLoots: 1, favoriteCategory: 'arcade' } })
        summary: LootGallerySummaryDto;

        constructor(
            loots: LootItemDto[],
            pagination: {
                currentPage: number;
                totalPages: number;
                totalItems: number;
                itemsPerPage: number;
            },
            summary: LootGallerySummaryDto
        ) {
            this.loots = loots;
            this.pagination = pagination;
            this.summary = summary;
        }
    }

    export class LootDetailImageDto {
        @ApiProperty({ type: Number, example: 1 })
        photoId: number;
        @ApiProperty({ type: String, example: 'image.jpg' })
        imageName: string;
        @ApiProperty({ type: Number, example: 1 })
        sortOrder: number;

        constructor(
            photoId: number,
            imageName: string,
            sortOrder: number
        ) {
            this.photoId = photoId;
            this.imageName = imageName;
            this.sortOrder = sortOrder;
        }
    }

    export class LootDetailStoreDto {
        @ApiProperty({ type: Number, example: 1 })
        storeId: number;
        @ApiProperty({ type: String, example: 'Sample Store' })
        storeName: string;
        @ApiProperty({ type: String, example: 'Seoul, Korea' })
        address: string;

        constructor(
            storeId: number,
            storeName: string,
            address: string
        ) {
            this.storeId = storeId;
            this.storeName = storeName;
            this.address = address;
        }
    }

    export class LootDetailTagDto {
        @ApiProperty({ type: Number, example: 1 })
        tagId: number;
        @ApiProperty({ type: String, example: 'fun' })
        tagName: string;

        constructor(
            tagId: number,
            tagName: string
        ) {
            this.tagId = tagId;
            this.tagName = tagName;
        }
    }

    export class LootDetailTradeDto {
        @ApiProperty({ type: Boolean, example: true })
        hasTradePost: boolean;
        @ApiProperty({ type: Number, example: 1, nullable: true })
        tradePostId: number | null;
        @ApiProperty({ type: String, example: 'active', nullable: true })
        status: string | null;

        constructor(
            hasTradePost: boolean,
            tradePostId: number | null,
            status: string | null
        ) {
            this.hasTradePost = hasTradePost;
            this.tradePostId = tradePostId;
            this.status = status;
        }
    }

    export class LootDetailDto {
        @ApiProperty({ type: Number, example: 1 })
        certificationId: number;
        @ApiProperty({ type: () => [LootDetailImageDto], example: [{ photoId: 1, imageName: 'image.jpg', sortOrder: 1 }] })
        images: LootDetailImageDto[];
        @ApiProperty({ type: () => LootDetailStoreDto, example: { storeId: 1, storeName: 'Sample Store', address: 'Seoul, Korea' } })
        store: LootDetailStoreDto;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        obtainedAt: Date;
        @ApiProperty({ type: String, example: 'Sample comment', nullable: true })
        comment: string | null;
        @ApiProperty({ type: () => [LootDetailTagDto], example: [{ tagId: 1, tagName: 'fun' }] })
        lootTags: LootDetailTagDto[];
        @ApiProperty({ type: Object, example: { gained: 1 } })
        experience: { gained: number };
        @ApiProperty({ type: () => LootDetailTradeDto, example: { hasTradePost: true, tradePostId: 1, status: 'active' } })
        tradePost: LootDetailTradeDto;

        constructor(
            certificationId: number,
            images: LootDetailImageDto[],
            store: LootDetailStoreDto,
            obtainedAt: Date,
            comment: string | null,
            lootTags: LootDetailTagDto[],
            experience: { gained: number },
            tradePost: LootDetailTradeDto
        ) {
            this.certificationId = certificationId;
            this.images = images;
            this.store = store;
            this.obtainedAt = obtainedAt;
            this.comment = comment;
            this.lootTags = lootTags;
            this.experience = experience;
            this.tradePost = tradePost;
        }
    }
    
    export class AchievementConditionDto {
        @ApiProperty({ type: String, example: 'type' })
        type: string;
        @ApiProperty({ type: Number, example: 1 })
        target: number;
        @ApiProperty({ type: Number, example: 1 })
        current: number;
        @ApiProperty({ type: String, example: 'Visit nearby stores', required: false })
        hint?: string;

        constructor(
            type: string,
            target: number,
            current: number,
            hint?: string
        ) {
            this.type = type;
            this.target = target;
            this.current = current;
            this.hint = hint;
        }
    }

    export class AchievementRewardDto {
        @ApiProperty({ type: Number, example: 50 })
        exp: number;

        constructor(exp: number) {
            this.exp = exp;
        }
    }

    export class AchievementDto {
        @ApiProperty({ type: Number, example: 1 })
        achievementId: number;
        @ApiProperty({ type: String, example: 'CODE123' })
        code: string;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Sample description' })
        description: string;
        @ApiProperty({ type: String, example: 'badge.png' })
        badgeImageName: string;
        @ApiProperty({ type: Boolean, example: true })
        isUnlocked: boolean;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z', nullable: true })
        earnedAt: Date | null;
        @ApiProperty({ type: () => AchievementConditionDto, example: { type: 'type', target: 1, current: 1, hint: 'Visit nearby stores' } })
        condition: AchievementConditionDto;
        @ApiProperty({ type: () => AchievementRewardDto, example: { exp: 50 } })
        reward: AchievementRewardDto;
        @ApiProperty({ type: Boolean, example: false })
        isHidden: boolean;

        constructor(
            achievementId: number,
            code: string,
            name: string,
            description: string,
            badgeImageName: string,
            isUnlocked: boolean,
            earnedAt: Date | null,
            condition: AchievementConditionDto,
            reward: AchievementRewardDto,
            isHidden: boolean
        ) {
            this.achievementId = achievementId;
            this.code = code;
            this.name = name;
            this.description = description;
            this.badgeImageName = badgeImageName;
            this.isUnlocked = isUnlocked;
            this.earnedAt = earnedAt;
            this.condition = condition;
            this.reward = reward;
            this.isHidden = isHidden;
        }
    }

    export class AchievementCategoryStatsDto {
        @ApiProperty({ type: String, example: 'arcade' })
        category: string;
        @ApiProperty({ type: String, example: 'string' })
        displayName: string;
        @ApiProperty({ type: Number, example: 3 })
        unlockedCount: number;
        @ApiProperty({ type: Number, example: 20 })
        totalCount: number;

        constructor(
            category: string,
            displayName: string,
            unlockedCount: number,
            totalCount: number
        ) {
            this.category = category;
            this.displayName = displayName;
            this.unlockedCount = unlockedCount;
            this.totalCount = totalCount;
        }
    }

    export class AchievementSummaryDto {
        @ApiProperty({ type: Number, example: 20 })
        totalAchievements: number;
        @ApiProperty({ type: Number, example: 3 })
        unlockedCount: number;
        @ApiProperty({ type: Number, example: 3 })
        lockedCount: number;
        @ApiProperty({ type: Number, example: 1 })
        completionRate: number;
        @ApiProperty({ type: Number, example: 1, nullable: true })
        featuredBadgeId: number | null;

        constructor(
            totalAchievements: number,
            unlockedCount: number,
            lockedCount: number,
            completionRate: number,
            featuredBadgeId: number | null
        ) {
            this.totalAchievements = totalAchievements;
            this.unlockedCount = unlockedCount;
            this.lockedCount = lockedCount;
            this.completionRate = completionRate;
            this.featuredBadgeId = featuredBadgeId;
        }
    }

    export class AchievementsDto {
        @ApiProperty({ type: () => AchievementSummaryDto, example: { totalAchievements: 20, unlockedCount: 3, lockedCount: 3, completionRate: 1, featuredBadgeId: 1 } })
        summary: AchievementSummaryDto;
        @ApiProperty({ type: () => [AchievementDto], example: [{ achievementId: 1, code: 'CODE123', name: 'Sample Name', description: 'Sample description', badgeImageName: 'badge.png', isUnlocked: true, earnedAt: '2024-01-01T00:00:00.000Z', condition: { type: 'type', target: 1, current: 1, hint: 'Visit nearby stores' }, reward: { exp: 50 }, isHidden: false }] })
        achievements: AchievementDto[];
        @ApiProperty({ type: () => [AchievementCategoryStatsDto], example: [{ category: 'arcade', displayName: 'string', unlockedCount: 3, totalCount: 20 }] })
        categoryStats: AchievementCategoryStatsDto[];

        constructor(
            summary: AchievementSummaryDto,
            achievements: AchievementDto[],
            categoryStats: AchievementCategoryStatsDto[]
        ) {
            this.summary = summary;
            this.achievements = achievements;
            this.categoryStats = categoryStats;
        }
    }

    export class FeaturedBadgeDto {
        @ApiProperty({ type: Number, example: 1 })
        achievementId: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'badge.png' })
        badgeImageName: string;

        constructor(
            achievementId: number,
            name: string,
            badgeImageName: string
        ) {
            this.achievementId = achievementId;
            this.name = name;
            this.badgeImageName = badgeImageName;
        }
    }

    export class SetFeaturedBadgeDto {
        @ApiProperty({ type: Boolean, example: true })
        success: boolean;
        @ApiProperty({ type: () => FeaturedBadgeDto, example: { achievementId: 1, name: 'Sample Name', badgeImageName: 'badge.png' }, nullable: true })
        featuredBadge: FeaturedBadgeDto | null;

        constructor(success: boolean, featuredBadge: FeaturedBadgeDto | null) {
            this.success = success;
            this.featuredBadge = featuredBadge;
        }
    }
}
