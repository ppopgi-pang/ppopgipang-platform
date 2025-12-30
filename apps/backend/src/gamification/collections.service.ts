import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionResult } from '@ppopgipang/types';
import { User } from 'src/users/entities/user.entity';
import { UserProgress } from './entities/user-progress.entity';
import { UserStamp } from './entities/user-stamp.entity';
import { Stamp } from './entities/stamp.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserStoreStats } from 'src/stores/entities/user-store-stats.entity';
import { Certification } from 'src/certifications/entities/certification.entity';
import { CertificationPhoto } from 'src/certifications/entities/certification-photo.entity';
import { LootTag } from 'src/certifications/entities/loot-tag.entity';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserLoot } from 'src/users/entities/user-loot.entity';
import { Trade } from 'src/trades/entities/trade.entity';

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserProgress)
        private readonly userProgressRepository: Repository<UserProgress>,
        @InjectRepository(UserStamp)
        private readonly userStampRepository: Repository<UserStamp>,
        @InjectRepository(Stamp)
        private readonly stampRepository: Repository<Stamp>,
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(UserStoreStats)
        private readonly userStoreStatsRepository: Repository<UserStoreStats>,
        @InjectRepository(Certification)
        private readonly certificationRepository: Repository<Certification>,
        @InjectRepository(CertificationPhoto)
        private readonly certificationPhotoRepository: Repository<CertificationPhoto>,
        @InjectRepository(LootTag)
        private readonly lootTagRepository: Repository<LootTag>,
        @InjectRepository(Achievement)
        private readonly achievementRepository: Repository<Achievement>,
        @InjectRepository(UserAchievement)
        private readonly userAchievementRepository: Repository<UserAchievement>,
        @InjectRepository(UserLoot)
        private readonly userLootRepository: Repository<UserLoot>,
        @InjectRepository(Trade)
        private readonly tradeRepository: Repository<Trade>,
    ) { }

    /**
     * 여권 메인 조회
     */
    async getPassport(
        userId: number,
        limit: number = 100,
        regionLimit: number = 10
    ): Promise<CollectionResult.PassportDto> {
        // 1. 프로필 정보 조회
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        let userProgress = await this.userProgressRepository.findOne({ where: { userId } });
        if (!userProgress) {
            // 프로그레스가 없으면 기본값 생성
            userProgress = this.userProgressRepository.create({
                userId,
                exp: 0,
                level: 1,
                streakDays: 0
            });
            await this.userProgressRepository.save(userProgress);
        }

        const expToNextLevel = (userProgress.level * 100) - userProgress.exp;

        const profile = new CollectionResult.ProfileSummaryDto(
            user.id,
            user.nickname,
            user.profileImage || null,
            userProgress.level,
            userProgress.exp,
            expToNextLevel,
            userProgress.streakDays
        );

        // 2. 스탬프 현황 조회
        const userStamps = await this.userStampRepository
            .createQueryBuilder('us')
            .leftJoinAndSelect('us.stamp', 'stamp')
            .leftJoinAndSelect('stamp.store', 'store')
            .leftJoinAndSelect('store.photos', 'photos')
            .where('us.userId = :userId', { userId })
            .orderBy('us.acquiredAt', 'DESC')
            .take(limit)
            .getMany();

        const stampStores: CollectionResult.StampStoreDto[] = [];

        for (const userStamp of userStamps) {
            if (!userStamp.stamp || !userStamp.stamp.store) continue;

            const store = userStamp.stamp.store;

            // Store 로고: type='cover' 찾기 또는 첫번째 사진
            let logoImageName: string | null = null;
            if (store.photos && store.photos.length > 0) {
                const coverPhoto = store.photos.find(p => (p as any).type === 'cover');
                logoImageName = coverPhoto ? coverPhoto.imageName : store.photos[0].imageName;
            }

            // 방문 통계 조회
            const stats = await this.userStoreStatsRepository.findOne({
                where: { userId, storeId: store.id }
            });

            stampStores.push(new CollectionResult.StampStoreDto(
                store.id,
                store.name,
                logoImageName,
                stats?.lastVisitedAt || userStamp.acquiredAt,
                stats?.visitCount || 1,
                store.region2 || '',
                store.region1 || ''
            ));
        }

        const stamps = new CollectionResult.StampsDto(
            userStamps.length,
            stampStores
        );

        // 3. 지역별 정복률
        const regionProgressList: CollectionResult.RegionProgressDto[] = [];

        // region1별 전체 가게 수 집계
        const regionTotals = await this.storeRepository
            .createQueryBuilder('store')
            .select('store.region1', 'region')
            .addSelect('COUNT(*)', 'total')
            .where('store.region1 IS NOT NULL')
            .groupBy('store.region1')
            .getRawMany();

        // 사용자가 방문한 가게 수 집계 (region1별)
        const visitedByRegion = await this.userStoreStatsRepository
            .createQueryBuilder('uss')
            .leftJoin('uss.store', 'store')
            .select('store.region1', 'region')
            .addSelect('COUNT(DISTINCT store.id)', 'visited')
            .where('uss.userId = :userId', { userId })
            .andWhere('store.region1 IS NOT NULL')
            .groupBy('store.region1')
            .getRawMany();

        const visitedMap = new Map(
            visitedByRegion.map(r => [r.region, parseInt(r.visited)])
        );

        for (const regionTotal of regionTotals) {
            const region = regionTotal.region;
            const total = parseInt(regionTotal.total);
            const visited = visitedMap.get(region) || 0;
            const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;

            regionProgressList.push(new CollectionResult.RegionProgressDto(
                region,
                visited,
                total,
                percentage
            ));
        }

        // 방문 비율 높은 순으로 정렬 후 제한
        regionProgressList.sort((a, b) => b.percentage - a.percentage);
        const topRegionProgress = regionProgressList.slice(0, regionLimit);

        // 4. 통계
        const allStats = await this.userStoreStatsRepository.find({
            where: { userId }
        });

        const totalVisits = allStats.reduce((sum, s) => sum + s.visitCount, 0);

        const totalLoots = await this.certificationRepository.count({
            where: { user: { id: userId }, type: 'loot' }
        });

        let favoriteStore: CollectionResult.FavoriteStoreDto | null = null;
        if (allStats.length > 0) {
            const favStat = allStats.reduce((prev, current) =>
                prev.visitCount > current.visitCount ? prev : current
            );

            const favStoreEntity = await this.storeRepository.findOne({
                where: { id: favStat.storeId }
            });

            if (favStoreEntity) {
                favoriteStore = new CollectionResult.FavoriteStoreDto(
                    favStoreEntity.id,
                    favStoreEntity.name,
                    favStat.visitCount
                );
            }
        }

        // 첫 방문일
        let firstVisitDate: Date | null = null;
        const firstCert = await this.certificationRepository.findOne({
            where: { user: { id: userId } },
            order: { occurredAt: 'ASC' }
        });
        if (firstCert) {
            firstVisitDate = firstCert.occurredAt;
        }

        const statistics = new CollectionResult.StatisticsDto(
            totalVisits,
            totalLoots,
            userProgress.streakDays,
            favoriteStore,
            firstVisitDate
        );

        return new CollectionResult.PassportDto(
            profile,
            stamps,
            topRegionProgress,
            statistics
        );
    }

    /**
     * 득템 갤러리 조회
     */
    async getLootGallery(
        userId: number,
        page: number,
        size: number,
        sortBy: string,
        storeId?: number
    ): Promise<CollectionResult.LootGalleryDto> {
        const qb = this.certificationRepository
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.photos', 'cp')
            .leftJoinAndSelect('c.store', 's')
            .leftJoinAndSelect('c.tags', 'lt')
            .where('c.userId = :userId', { userId })
            .andWhere('c.type = :type', { type: 'loot' });

        if (storeId) {
            qb.andWhere('c.storeId = :storeId', { storeId });
        }

        // 정렬
        if (sortBy === 'recent') {
            qb.orderBy('c.occurredAt', 'DESC');
        } else {
            qb.orderBy('c.occurredAt', 'ASC');
        }

        // photos의 sortOrder로도 정렬
        qb.addOrderBy('cp.sortOrder', 'ASC');

        // 전체 개수
        const total = await qb.getCount();

        // 페이지네이션
        const certifications = await qb
            .skip((page - 1) * size)
            .take(size)
            .getMany();

        const lootItems: CollectionResult.LootItemDto[] = [];

        for (const cert of certifications) {
            // 첫 번째 이미지
            const imageName = cert.photos && cert.photos.length > 0
                ? cert.photos[0].imageName
                : '';

            // 태그 목록
            const lootTags = cert.tags ? cert.tags.map(t => t.name) : [];

            // 교환글 여부 확인
            let hasTradePost = false;
            let tradePostId: number | null = null;

            const userLoot = await this.userLootRepository.findOne({
                where: { certification: { id: cert.id } },
                relations: ['certification']
            });

            if (userLoot) {
                const trade = await this.tradeRepository.findOne({
                    where: { loot: { id: userLoot.id } },
                    relations: ['loot']
                });

                if (trade) {
                    hasTradePost = true;
                    tradePostId = trade.id;
                }
            }

            lootItems.push(new CollectionResult.LootItemDto(
                cert.id,
                imageName,
                cert.store.name,
                cert.store.id,
                cert.occurredAt,
                cert.comment || null,
                lootTags,
                hasTradePost,
                tradePostId
            ));
        }

        // 요약 정보
        const totalLoots = total;

        // 이번 달 득템 개수
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthLoots = await this.certificationRepository.count({
            where: {
                user: { id: userId },
                type: 'loot'
            }
        });

        // 가장 많이 사용한 태그 (favoriteCategory)
        let favoriteCategory: string | null = null;
        const tagCounts = await this.certificationRepository
            .createQueryBuilder('c')
            .leftJoin('c.tags', 't')
            .select('t.name', 'tagName')
            .addSelect('COUNT(t.id)', 'count')
            .where('c.userId = :userId', { userId })
            .andWhere('c.type = :type', { type: 'loot' })
            .andWhere('t.name IS NOT NULL')
            .groupBy('t.name')
            .orderBy('count', 'DESC')
            .limit(1)
            .getRawOne();

        if (tagCounts && tagCounts.tagName) {
            favoriteCategory = tagCounts.tagName;
        }

        const summary = new CollectionResult.LootGallerySummaryDto(
            totalLoots,
            thisMonthLoots,
            favoriteCategory
        );

        const totalPages = Math.ceil(total / size);

        return new CollectionResult.LootGalleryDto(
            lootItems,
            {
                currentPage: page,
                totalPages: totalPages,
                totalItems: total,
                itemsPerPage: size
            },
            summary
        );
    }

    /**
     * 득템 상세 조회
     */
    async getLootDetail(
        userId: number,
        certificationId: number
    ): Promise<CollectionResult.LootDetailDto> {
        const certification = await this.certificationRepository.findOne({
            where: { id: certificationId },
            relations: ['photos', 'store', 'tags', 'user']
        });

        if (!certification) {
            throw new NotFoundException('Certification not found');
        }

        if (certification.user.id !== userId) {
            throw new ForbiddenException('You do not have permission to view this loot');
        }

        if (certification.type !== 'loot') {
            throw new NotFoundException('This is not a loot certification');
        }

        // 이미지 목록
        const images = certification.photos.map(p =>
            new CollectionResult.LootDetailImageDto(
                p.id,
                p.imageName,
                p.sortOrder
            )
        );

        // 가게 정보
        const store = new CollectionResult.LootDetailStoreDto(
            certification.store.id,
            certification.store.name,
            certification.store.address || ''
        );

        // 태그 목록
        const lootTags = certification.tags.map(t =>
            new CollectionResult.LootDetailTagDto(
                t.id,
                t.name
            )
        );

        // 경험치
        const experience = { gained: certification.exp };

        // 교환글 정보
        let hasTradePost = false;
        let tradePostId: number | null = null;
        let status: string | null = null;

        const userLoot = await this.userLootRepository.findOne({
            where: { certification: { id: certificationId } },
            relations: ['certification']
        });

        if (userLoot) {
            const trade = await this.tradeRepository.findOne({
                where: { loot: { id: userLoot.id } },
                relations: ['loot']
            });

            if (trade) {
                hasTradePost = true;
                tradePostId = trade.id;
                status = trade.status;
            }
        }

        const tradePost = new CollectionResult.LootDetailTradeDto(
            hasTradePost,
            tradePostId,
            status
        );

        return new CollectionResult.LootDetailDto(
            certification.id,
            images,
            store,
            certification.occurredAt,
            certification.comment || null,
            lootTags,
            experience,
            tradePost
        );
    }

    /**
     * 업적/배지 현황 조회
     */
    async getAchievements(
        userId: number,
        status?: string
    ): Promise<CollectionResult.AchievementsDto> {
        // 모든 업적 조회
        const achievements = await this.achievementRepository.find({
            where: { isHidden: false }
        });

        // 사용자 획득 업적 조회
        const userAchievements = await this.userAchievementRepository.find({
            where: { userId }
        });

        const earnedMap = new Map(
            userAchievements.map(ua => [ua.achievementId, ua.earnedAt])
        );

        // 업적 DTO 생성
        const achievementDtos: CollectionResult.AchievementDto[] = [];

        for (const ach of achievements) {
            const isUnlocked = earnedMap.has(ach.id);
            const earnedAt = earnedMap.get(ach.id) || null;

            // 진행도 계산
            const conditionJson = ach.conditionJson || { type: 'unknown', target: 0 };
            let current = 0;

            if (conditionJson.type === 'loot_count') {
                current = await this.certificationRepository.count({
                    where: { user: { id: userId }, type: 'loot' }
                });
            } else if (conditionJson.type === 'visit_count') {
                const stats = await this.userStoreStatsRepository.find({
                    where: { userId }
                });
                current = stats.reduce((sum, s) => sum + s.visitCount, 0);
            } else if (conditionJson.type === 'store_count') {
                current = await this.userStoreStatsRepository.count({
                    where: { userId }
                });
            } else if (conditionJson.type === 'streak_days') {
                const userProgress = await this.userProgressRepository.findOne({
                    where: { userId }
                });
                current = userProgress?.streakDays || 0;
            } else if (conditionJson.type === 'level') {
                const userProgress = await this.userProgressRepository.findOne({
                    where: { userId }
                });
                current = userProgress?.level || 1;
            }

            const condition = new CollectionResult.AchievementConditionDto(
                conditionJson.type,
                conditionJson.target || 0,
                current,
                conditionJson.hint
            );

            const reward = new CollectionResult.AchievementRewardDto(
                conditionJson.reward?.exp || 0
            );

            const achievementDto = new CollectionResult.AchievementDto(
                ach.id,
                ach.code,
                ach.name,
                ach.description,
                ach.badgeImageName || '',
                isUnlocked,
                earnedAt,
                condition,
                reward,
                ach.isHidden
            );

            // 상태 필터링
            if (status === 'unlocked' && !isUnlocked) continue;
            if (status === 'locked' && isUnlocked) continue;

            achievementDtos.push(achievementDto);
        }

        // 카테고리별 통계 (conditionJson.category 사용)
        const categoryMap = new Map<string, { unlocked: number; total: number }>();

        for (const ach of achievements) {
            const category = ach.conditionJson?.category || 'general';
            if (!categoryMap.has(category)) {
                categoryMap.set(category, { unlocked: 0, total: 0 });
            }
            const stat = categoryMap.get(category)!;
            stat.total += 1;
            if (earnedMap.has(ach.id)) {
                stat.unlocked += 1;
            }
        }

        const categoryDisplayNames: { [key: string]: string } = {
            general: '일반',
            loot: '득템',
            visit: '방문',
            social: '소셜',
            level: '레벨'
        };

        const categoryStats: CollectionResult.AchievementCategoryStatsDto[] = [];
        for (const [category, stat] of categoryMap.entries()) {
            categoryStats.push(new CollectionResult.AchievementCategoryStatsDto(
                category,
                categoryDisplayNames[category] || category,
                stat.unlocked,
                stat.total
            ));
        }

        // 대표 배지 조회
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const featuredBadgeId = (user as any).featuredBadgeId || null;

        // 요약
        const totalAchievements = achievements.length;
        const unlockedCount = userAchievements.length;
        const lockedCount = totalAchievements - unlockedCount;
        const completionRate = totalAchievements > 0
            ? Math.round((unlockedCount / totalAchievements) * 100)
            : 0;

        const summary = new CollectionResult.AchievementSummaryDto(
            totalAchievements,
            unlockedCount,
            lockedCount,
            completionRate,
            featuredBadgeId
        );

        return new CollectionResult.AchievementsDto(
            summary,
            achievementDtos,
            categoryStats
        );
    }

    /**
     * 대표 배지 설정/해제
     */
    async setFeaturedBadge(
        userId: number,
        achievementId: number | null
    ): Promise<CollectionResult.SetFeaturedBadgeDto> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (achievementId === null) {
            // 대표 배지 해제
            (user as any).featuredBadgeId = null;
            await this.userRepository.save(user);

            return new CollectionResult.SetFeaturedBadgeDto(true, null);
        }

        // 업적이 존재하는지 확인
        const achievement = await this.achievementRepository.findOne({
            where: { id: achievementId }
        });

        if (!achievement) {
            throw new NotFoundException('Achievement not found');
        }

        // 사용자가 해당 업적을 획득했는지 확인
        const userAchievement = await this.userAchievementRepository.findOne({
            where: { userId, achievementId }
        });

        if (!userAchievement) {
            throw new ForbiddenException('You have not unlocked this achievement');
        }

        // 대표 배지 설정
        (user as any).featuredBadgeId = achievementId;
        await this.userRepository.save(user);

        const featuredBadge = new CollectionResult.FeaturedBadgeDto(
            achievement.id,
            achievement.name,
            achievement.badgeImageName || ''
        );

        return new CollectionResult.SetFeaturedBadgeDto(true, featuredBadge);
    }
}
