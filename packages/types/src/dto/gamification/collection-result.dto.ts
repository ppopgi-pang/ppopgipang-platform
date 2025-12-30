export namespace CollectionResult {
    // ===== 여권 (Passport) =====
    export class ProfileSummaryDto {
        userId: number;
        nickname: string;
        profileImage: string | null;
        currentLevel: number;
        currentExp: number;
        expToNextLevel: number;
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
        storeId: number;
        storeName: string;
        logoImageName: string | null;
        lastVisitedAt: Date;
        visitCount: number;
        district: string;
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
        totalVisited: number;
        stores: StampStoreDto[];

        constructor(totalVisited: number, stores: StampStoreDto[]) {
            this.totalVisited = totalVisited;
            this.stores = stores;
        }
    }

    export class RegionProgressDto {
        region: string;
        visitedCount: number;
        totalStores: number;
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
        storeId: number;
        storeName: string;
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
        totalVisits: number;
        totalLoots: number;
        consecutiveDays: number;
        favoriteStore: FavoriteStoreDto | null;
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
        profile: ProfileSummaryDto;
        stamps: StampsDto;
        regionProgress: RegionProgressDto[];
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
        certificationId: number;
        imageName: string;
        storeName: string;
        storeId: number;
        obtainedAt: Date;
        comment: string | null;
        lootTags: string[];
        hasTradePost: boolean;
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
        totalLoots: number;
        thisMonthLoots: number;
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
        loots: LootItemDto[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
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
        photoId: number;
        imageName: string;
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
        storeId: number;
        storeName: string;
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
        tagId: number;
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
        hasTradePost: boolean;
        tradePostId: number | null;
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
        certificationId: number;
        images: LootDetailImageDto[];
        store: LootDetailStoreDto;
        obtainedAt: Date;
        comment: string | null;
        lootTags: LootDetailTagDto[];
        experience: { gained: number };
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

    // ===== 업적/배지 =====
    export class AchievementConditionDto {
        type: string;
        target: number;
        current: number;
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
        exp: number;

        constructor(exp: number) {
            this.exp = exp;
        }
    }

    export class AchievementDto {
        achievementId: number;
        code: string;
        name: string;
        description: string;
        badgeImageName: string;
        isUnlocked: boolean;
        earnedAt: Date | null;
        condition: AchievementConditionDto;
        reward: AchievementRewardDto;
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
        category: string;
        displayName: string;
        unlockedCount: number;
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
        totalAchievements: number;
        unlockedCount: number;
        lockedCount: number;
        completionRate: number;
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
        summary: AchievementSummaryDto;
        achievements: AchievementDto[];
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
        achievementId: number;
        name: string;
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
        success: boolean;
        featuredBadge: FeaturedBadgeDto | null;

        constructor(success: boolean, featuredBadge: FeaturedBadgeDto | null) {
            this.success = success;
            this.featuredBadge = featuredBadge;
        }
    }
}
