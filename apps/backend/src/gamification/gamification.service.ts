import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserProgress } from './entities/user-progress.entity';
import { UserStamp } from './entities/user-stamp.entity';
import { Stamp } from './entities/stamp.entity';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserStoreStats } from 'src/stores/entities/user-store-stats.entity';
import { Certification } from 'src/certifications/entities/certification.entity';
import { CertificationResult } from '@ppopgipang/types';
import { Store } from 'src/stores/entities/store.entity';

@Injectable()
export class GamificationService {
    constructor(
        @InjectRepository(UserProgress)
        private readonly userProgressRepository: Repository<UserProgress>,
        @InjectRepository(UserStamp)
        private readonly userStampRepository: Repository<UserStamp>,
        @InjectRepository(Stamp)
        private readonly stampRepository: Repository<Stamp>,
        @InjectRepository(Achievement)
        private readonly achievementRepository: Repository<Achievement>,
        @InjectRepository(UserAchievement)
        private readonly userAchievementRepository: Repository<UserAchievement>,
        @InjectRepository(UserStoreStats)
        private readonly userStoreStatsRepository: Repository<UserStoreStats>,
        @InjectRepository(Certification)
        private readonly certificationRepository: Repository<Certification>,
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        private readonly dataSource: DataSource
    ) { }

    /**
     * 인증 완료 후 보상 처리
     */
    async processCertification(
        userId: number,
        storeId: number,
        type: 'loot' | 'checkin',
        expAmount: number
    ): Promise<CertificationResult.RewardsDto> {
        return await this.dataSource.transaction(async manager => {
            // 1. EXP 추가 & 레벨업 체크
            let userProgress = await manager.findOne(UserProgress, { where: { userId } });

            if (!userProgress) {
                userProgress = manager.create(UserProgress, {
                    userId,
                    exp: 0,
                    level: 1,
                    streakDays: 0
                });
            }

            const oldLevel = userProgress.level;
            const oldExp = userProgress.exp;
            const newExp = oldExp + expAmount;
            const newLevel = this.calculateLevel(newExp);
            const levelUp = newLevel > oldLevel;

            userProgress.exp = newExp;
            userProgress.level = newLevel;
            userProgress.lastActivityAt = new Date();

            await manager.save(UserProgress, userProgress);

            // 2. user_store_stats 업데이트
            await this.updateStoreStats(manager, userId, storeId, type);

            // 3. 스탬프 지급 (첫 방문 시)
            const newStamp = await this.checkAndGrantStamp(manager, userId, storeId);

            // 4. 배지 체크 & 지급
            const newBadges = await this.checkAndGrantBadges(manager, userId, type);

            // 5. 연속 방문일 업데이트 (간단 구현)
            await this.updateStreak(manager, userProgress);

            // 6. 다음 레벨까지 필요한 EXP 계산
            const expToNextLevel = (newLevel * 100) - newExp;

            return new CertificationResult.RewardsDto(
                expAmount,
                newExp,
                newLevel,
                levelUp,
                expToNextLevel,
                levelUp ? newLevel : undefined,
                newStamp,
                newBadges
            );
        });
    }

    /**
     * 레벨 계산 공식
     * Level = floor(totalExp / 100) + 1
     */
    private calculateLevel(totalExp: number): number {
        return Math.floor(totalExp / 100) + 1;
    }

    /**
     * user_store_stats 업데이트
     */
    private async updateStoreStats(
        manager: any,
        userId: number,
        storeId: number,
        type: 'loot' | 'checkin'
    ): Promise<void> {
        let stat = await manager.findOne(UserStoreStats, { where: { userId, storeId } });

        if (!stat) {
            stat = manager.create(UserStoreStats, {
                userId,
                storeId,
                visitCount: 1,
                lootCount: type === 'loot' ? 1 : 0,
                lastVisitedAt: new Date(),
                tier: 'visited',
                isScrapped: false
            });
        } else {
            stat.visitCount += 1;
            if (type === 'loot') {
                stat.lootCount += 1;
            }
            stat.lastVisitedAt = new Date();

            // 티어 업데이트
            if (stat.visitCount >= 5) {
                stat.tier = 'master';
            } else {
                stat.tier = 'visited';
            }
        }

        await manager.save(UserStoreStats, stat);
    }

    /**
     * 스탬프 지급 체크 (첫 방문 시)
     */
    private async checkAndGrantStamp(
        manager: any,
        userId: number,
        storeId: number
    ): Promise<CertificationResult.NewStampDto | undefined> {
        // 해당 가게의 이전 인증 횟수 확인
        const previousCertCount = await manager.count(Certification, {
            where: { userId, storeId }
        });

        // 첫 방문이 아니면 스탬프 지급 안함
        if (previousCertCount > 0) {
            return undefined;
        }

        // 해당 가게의 스탬프 찾기
        const stamp = await manager.findOne(Stamp, {
            where: { storeId },
            relations: ['store']
        });

        if (!stamp) {
            return undefined;
        }

        // 이미 획득한 스탬프인지 확인
        const existingUserStamp = await manager.findOne(UserStamp, {
            where: { userId, stampId: stamp.id }
        });

        if (existingUserStamp) {
            return undefined;
        }

        // 스탬프 지급
        const userStamp = manager.create(UserStamp, {
            userId,
            stampId: stamp.id,
            acquiredAt: new Date()
        });
        await manager.save(UserStamp, userStamp);

        return new CertificationResult.NewStampDto(
            stamp.id,
            stamp.imageName,
            stamp.store.name
        );
    }

    /**
     * 배지 달성 체크 & 지급
     */
    private async checkAndGrantBadges(
        manager: EntityManager,
        userId: number,
        type: 'loot' | 'checkin'
    ): Promise<CertificationResult.NewBadgeDto[]> {
        const newBadges: CertificationResult.NewBadgeDto[] = [];

        // 이미 획득한 배지 목록
        const userAchievements = await manager.find(UserAchievement, { where: { userId } });
        const acquiredBadgeIds = new Set(userAchievements.map(ua => ua.achievementId));

        // 체크할 배지 목록
        const badgesToCheck = [
            'FIRST_LOOT',
            'FIRST_CHECKIN',
            'LOOT_10',
            'VISIT_5_STORES',
            'STREAK_7'
        ];

        for (const badgeCode of badgesToCheck) {
            const achievement = await manager.findOne(Achievement, { where: { code: badgeCode } });

            if (!achievement || acquiredBadgeIds.has(achievement.id)) {
                continue;
            }

            let shouldGrant: boolean | null = false;

            // 배지별 조건 체크
            switch (badgeCode) {
                case 'FIRST_LOOT':
                    if (type === 'loot') {
                        const lootCount = await manager.count(Certification, {
                            where: { user: { id: userId }, type: 'loot' },
                            relations: ['User']
                        });
                        shouldGrant = lootCount === 1;
                    }
                    break;

                case 'FIRST_CHECKIN':
                    if (type === 'checkin') {
                        const checkinCount = await manager.count(Certification, {
                            where: { user: { id: userId }, type: 'checkin' },
                            relations: ['User']
                        });
                        shouldGrant = checkinCount === 1;
                    }
                    break;

                case 'LOOT_10':
                    const lootCount = await manager.count(Certification, {
                        where: { user: { id : userId }, type: 'loot' },
                        relations: ['User']
                    });
                    shouldGrant = lootCount >= 10;
                    break;

                case 'VISIT_5_STORES':
                    const visitedStoresCount = await manager
                        .createQueryBuilder(UserStoreStats, 'uss')
                        .where('uss.userId = :userId', { userId })
                        .andWhere('uss.visitCount > 0')
                        .getCount();
                    shouldGrant = visitedStoresCount >= 5;
                    break;

                case 'STREAK_7':
                    const userProgress = await manager.findOne(UserProgress, { where: { userId } });
                    shouldGrant = userProgress && userProgress.streakDays >= 7;
                    break;
            }

            if (shouldGrant) {
                const userAchievement = manager.create(UserAchievement, {
                    userId,
                    achievementId: achievement.id,
                    acquiredAt: new Date()
                });
                await manager.save(UserAchievement, userAchievement);

                newBadges.push(new CertificationResult.NewBadgeDto(
                    achievement.id,
                    achievement.code,
                    achievement.name,
                    achievement.description,
                    achievement.badgeImageName
                ));
            }
        }

        return newBadges;
    }

    /**
     * 연속 방문일 업데이트
     */
    private async updateStreak(manager: any, userProgress: UserProgress): Promise<void> {
        const now = new Date();
        const lastActivity = userProgress.lastActivityAt;

        if (!lastActivity) {
            userProgress.streakDays = 1;
            return;
        }

        const daysDiff = Math.floor(
            (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 0) {
            // 같은 날 - 유지
            return;
        } else if (daysDiff === 1) {
            // 연속 방문
            userProgress.streakDays += 1;
        } else {
            // 연속 끊김
            userProgress.streakDays = 1;
        }

        await manager.save(UserProgress, userProgress);
    }
}
