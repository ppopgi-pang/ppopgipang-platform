import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { Certification } from 'src/certifications/entities/certification.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserStoreResult } from '@ppopgipang/types';

@Injectable()
export class QuestService {
    constructor(
        @InjectRepository(Achievement)
        private achievementRepository: Repository<Achievement>,
        @InjectRepository(UserAchievement)
        private userAchievementRepository: Repository<UserAchievement>,
        @InjectRepository(Certification)
        private certificationRepository: Repository<Certification>,
    ) { }

    /**
     * 특정 가게에서 달성 가능한 퀘스트 목록 조회
     * @param store 가게 정보
     * @param userId 유저 ID (옵션)
     */
    async getAvailableQuests(store: Store, userId?: number): Promise<UserStoreResult.QuestInfoDto[]> {
        const allAchievements: Achievement[] = [];

        // 1. 해당 지역 관련 배지 조회 (예: 마포구 인형사)
        if (store.region1 || store.region2) {
            const regionAchievements = await this.achievementRepository
                .createQueryBuilder('a')
                .where('a.isHidden = false')
                .andWhere(
                    '(JSON_EXTRACT(a.conditionJson, "$.region1") = :region1 OR JSON_EXTRACT(a.conditionJson, "$.region2") = :region2)',
                    { region1: store.region1, region2: store.region2 }
                )
                .getMany();
            allAchievements.push(...regionAchievements);
        }

        // 2. 카테고리 관련 배지 조회 (예: 인형 전문가)
        // Note: Store entity에 category 필드가 없으므로 type.name을 사용
        if (store.type) {
            const categoryAchievements = await this.achievementRepository
                .createQueryBuilder('a')
                .where('a.isHidden = false')
                .andWhere(
                    'JSON_EXTRACT(a.conditionJson, "$.storeType") = :storeType',
                    { storeType: store.type.name }
                )
                .getMany();
            allAchievements.push(...categoryAchievements);
        }

        // 중복 제거
        const uniqueAchievements = Array.from(
            new Map(allAchievements.map(a => [a.id, a])).values()
        );

        // 3. 유저의 달성 여부 및 진행도 확인
        if (userId) {
            const userAchievements = await this.userAchievementRepository.find({
                where: { userId },
                select: ['achievementId']
            });
            const completedIds = new Set(userAchievements.map(ua => ua.achievementId));

            return Promise.all(uniqueAchievements.map(async (a) => {
                const progress = await this.calculateProgress(a, userId, store.id);
                return new UserStoreResult.QuestInfoDto(
                    a.id,
                    a.code,
                    a.name,
                    a.description,
                    a.badgeImageName,
                    this.formatCondition(a.conditionJson),
                    progress,
                    completedIds.has(a.id)
                );
            }));
        }

        return uniqueAchievements.map(a => new UserStoreResult.QuestInfoDto(
            a.id,
            a.code,
            a.name,
            a.description,
            a.badgeImageName,
            this.formatCondition(a.conditionJson)
        ));
    }

    /**
     * 업적 진행도 계산
     */
    private async calculateProgress(achievement: Achievement, userId: number, storeId: number): Promise<number> {
        const condition = achievement.conditionJson;
        if (!condition) return 0;

        // 예시: { type: 'loot_count', region2: '마포구', category: 'plush', target: 10 }
        if (condition.type === 'loot_count') {
            const qb = this.certificationRepository
                .createQueryBuilder('c')
                .innerJoin('c.store', 's')
                .where('c.userId = :userId', { userId })
                .andWhere('c.type = :type', { type: 'loot' });

            // 지역 필터 추가
            if (condition.region1) {
                qb.andWhere('s.region1 = :region1', { region1: condition.region1 });
            }
            if (condition.region2) {
                qb.andWhere('s.region2 = :region2', { region2: condition.region2 });
            }

            // 카테고리 필터 추가 (store type으로 필터링)
            if (condition.storeType) {
                qb.innerJoin('s.type', 'st')
                    .andWhere('st.name = :storeType', { storeType: condition.storeType });
            }

            const count = await qb.getCount();
            const target = condition.target || 1;
            return Math.min((count / target) * 100, 100);
        }

        // 다른 타입의 조건들 (방문 횟수, 특정 아이템 등)
        if (condition.type === 'visit_count') {
            // UserStoreStats를 사용해야 하므로 여기서는 생략
            return 0;
        }

        return 0;
    }

    /**
     * conditionJson을 사용자 친화적인 문자열로 변환
     */
    private formatCondition(conditionJson: any): string {
        if (!conditionJson) return '';

        // 카테고리 이름 매핑
        const categoryNames: Record<string, string> = {
            'plush': '인형',
            'figure': '피규어',
            'keyring': '키링',
            'snack': '간식',
            '뽑기': '뽑기 아이템'
        };

        if (conditionJson.type === 'loot_count') {
            const region = conditionJson.region2 || conditionJson.region1 || '';
            const storeType = conditionJson.storeType || '';
            const category = categoryNames[storeType] || storeType || '아이템';
            const target = conditionJson.target || 1;

            if (region && storeType) {
                return `${region}에서 ${category} ${target}회 득템`;
            } else if (region) {
                return `${region}에서 ${target}회 득템`;
            } else if (storeType) {
                return `${category} ${target}회 득템`;
            } else {
                return `${target}회 득템`;
            }
        }

        if (conditionJson.type === 'visit_count') {
            const target = conditionJson.target || 1;
            return `${target}회 방문`;
        }

        return '';
    }
}
