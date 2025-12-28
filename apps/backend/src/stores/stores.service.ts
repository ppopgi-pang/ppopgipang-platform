import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { In, Like, MoreThan, Repository } from 'typeorm';
import { AdminStoreInput, AuthResult, ReviewResult, StoreTypeInput, StoreTypeResult, UserStoreResult } from '@ppopgipang/types';
import { StoreType } from './entities/store-type.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { UserStoreStats } from './entities/user-store-stats.entity';
import { UsersService } from 'src/users/users.service';
import { Certification } from 'src/certifications/entities/certification.entity';
import { UserStamp } from 'src/gamification/entities/user-stamp.entity';
import { StoreAnalytics } from './entities/store-analytics.entity';
import { StoreFacility } from './entities/store-facility.entity';
import { QuestService } from 'src/gamification/quest.service';


@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(StoreType)
        private readonly storeTypeRepository: Repository<StoreType>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(UserStoreStats)
        private readonly userStoreStatsRepository: Repository<UserStoreStats>,
        @InjectRepository(Certification)
        private readonly certificationRepository: Repository<Certification>,
        @InjectRepository(UserStamp)
        private readonly userStampRepository: Repository<UserStamp>,
        @InjectRepository(StoreAnalytics)
        private readonly storeAnalyticsRepository: Repository<StoreAnalytics>,
        @InjectRepository(StoreFacility)
        private readonly storeFacilityRepository: Repository<StoreFacility>,
        private readonly usersService: UsersService,
        private readonly questService: QuestService
    ) { }

    async findStoreDetail(id: number) {

        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['openingHours', 'facilities', 'photos', 'type']
        });

        if (!store) throw new NotFoundException('존재하지 않는 가게입니다.');

        const reviews = await this.reviewRepository.find({
            where: { store },
            relations: { user: true },
            take: 5,
            order: { createdAt: 'DESC' }
        });
        if (!reviews) throw new NotFoundException('존재하지 않는 리뷰입니다.');


        const reviewsDto = reviews.map(review => new ReviewResult.ReviewDto(
            review.id,
            review.rating,
            review.content,
            review.images ?? [],
            new AuthResult.UserInfo(review.user),
            new ReviewResult.StoreInfoDto(
                store.id,
                store.name,
                store.address
            ),
            review.createdAt,
            review.updatedAt
        ));

        const storeDto = new UserStoreResult.StoreDto(
            store.id,
            store.name,
            store.address,
            store.latitude,
            store.longitude,
            store.phone
        );

        const result = new UserStoreResult.StoreDetailDto(reviewsDto, storeDto);

        return result;
    }

    /**
     * (어드민) 가게 생성 메서드
     * @param dto
     * @returns 
     */
    async createStore(dto: AdminStoreInput.CreateStoreDto) {
        const storeType = await this.storeTypeRepository.findOneBy({ id: dto.typeId });
        if (!storeType) throw new NotFoundException('존재하지 않는 가게 타입(카테고리)입니다.');
        return await this.storeRepository.save(dto);
    }

    /**
     * (사용자) 바운드 서치
     * @param north 
     * @param south 
     * @param east 
     * @param west 
     * @param keyword 
     * @returns 
     */
    async searchInBounds(north: number, south: number, east: number, west: number, keyword?: string) {
        const qb = this.storeRepository.createQueryBuilder('s')
            .leftJoinAndSelect('s.type', 'st')
            .select([
                's.id',
                's.name',
                's.address',
                's.latitude',
                's.longitude',
                'st.id',
                'st.name'
            ])
            .where('s.latitude BETWEEN :south AND :north', { south, north })
            .andWhere('s.longitude BETWEEN :west AND :east', { west, east });

        if (keyword) {
            qb.andWhere(
                '(s.name LIKE :keyword OR s.address LIKE :keyword)',
                { keyword: `%${keyword}%` }
            );
        }

        const [data, total] = await qb.getManyAndCount();

        return new UserStoreResult.InBoundSearchDto(true, data, { count: total });
    }

    /**
     * (어드민) 가게 카테고리(타입) 생성 메서드
     * @param dto 
     * @returns 
     */
    async createStoreType(dto: StoreTypeInput.CreateStoreTypeDto) {
        return await this.storeTypeRepository.save(dto);
    }

    /**
     * (어드민) 가게 카테고리(타입) 목록 조회 메서드
     * @returns 
     */
    async findStoreTypes(): Promise<StoreTypeResult.ListTypeDto> {
        const storeTypes = await this.storeTypeRepository.find();
        return new StoreTypeResult.ListTypeDto(storeTypes);
    }

    /**
     * (사용자) 가게 목록 반경 검색
     * @param latitude 
     * @param longitude 
     * @param radius 
     * @param page 
     * @param size 
     * @param keyword 
     * @returns 
     */
    async findNearByStores(latitude: number, longitude: number, radius = 3000, page = 1, size = 20, keyword?: string) {
        const qb = this.storeRepository.createQueryBuilder('s')
            .addSelect(
                `ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(s.longitude, s.latitude))`,
                'distance'
            )
            .where(`ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(s.longitude, s.latitude)) <= :radius`, {
                latitude,
                longitude,
                radius
            })
            .setParameters({ latitude, longitude, radius })

        if (keyword) {
            qb.andWhere('s.name LIKE :keyword', { keyword: `%${keyword}%` });
        }

        const total = await qb.getCount();

        const { entities, raw } = await qb
            .orderBy('distance', 'ASC')
            .offset((page - 1) * size)
            .limit(size)
            .getRawAndEntities();

        const data = entities.map((store, i) => ({
            ...store,
            distance: Math.round(raw[i].distance),
        }));

        return new UserStoreResult.FindNearByDto(true, data, { count: total });
    }

    /**
     * 가게 검색
     */
    async searchStore(keyword: string, latitude: number = 0, longitude: number = 0, page: number, size: number, userId?: number) {
        if (userId && keyword) {
            // 비동기로 처리하여 응답 속도 저하 방지
            this.usersService.addSearchHistory(userId, keyword).catch(e => console.error('Search history save failed', e));
        }

        const qb = this.storeRepository.createQueryBuilder('s')
            .leftJoinAndSelect('s.type', 'st')
            .leftJoinAndSelect('s.photos', 'sp') // 썸네일 필요시
            .where('s.name LIKE :keyword OR s.address LIKE :keyword', { keyword: `%${keyword}%` });

        if (latitude && longitude) {
            qb.addSelect(
                `ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(s.longitude, s.latitude))`,
                'distance'
            )
                .setParameters({ latitude, longitude });
            qb.orderBy('distance', 'ASC');
        } else {
            qb.orderBy('s.name', 'ASC');
        }

        const count = await qb.getCount();
        const { entities, raw } = await qb
            .offset((page - 1) * size)
            .limit(size)
            .getRawAndEntities();

        // userId가 있으면 UserStoreStats를 한 번에 조회
        let userStatsMap = new Map<number, UserStoreStats>();
        if (userId && entities.length > 0) {
            const storeIds = entities.map(s => s.id);
            const stats = await this.userStoreStatsRepository.find({
                where: { userId, storeId: storeIds as any }
            });
            stats.forEach(stat => userStatsMap.set(stat.storeId, stat));
        }

        const data = entities.map((store, i) => {
            const dist = raw[i].distance ? Math.round(raw[i].distance) : undefined;
            const thumbnail = store.photos.find(p => p.type === 'cover')?.imageName || store.photos[0]?.imageName || null;
            const isVisited = userId ? userStatsMap.has(store.id) && (userStatsMap.get(store.id)?.visitCount || 0) > 0 : false;

            const dto = new UserStoreResult.StoreDto(
                store.id,
                store.name,
                store.address,
                store.latitude,
                store.longitude,
                store.phone
            );
            dto.distance = dist;
            dto.averageRating = store.averageRating;
            dto.thumbnailUrl = thumbnail;
            dto.isVisited = isVisited;
            return dto;
        });

        return new UserStoreResult.SearchDto(true, data, { count });
    }

    async findStoreSummary(id: number) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['photos']
        });
        if (!store) throw new NotFoundException('존재하지 않는 가게입니다.');

        const thumbnail = store.photos.find(p => p.type === 'cover')?.imageName || store.photos[0]?.imageName || null;
        // isScrapped 확인은 별도 로직 필요, userId가 필요함.
        // 하지만 Summary 요청 시 AuthGuard가 없으면 false.
        // Controller에서 userId를 넘겨줘야 함. 
        // 여기서는 일단 false로 처리하거나 userId 인자를 추가해야 함.
        // Task description implies checking user_store_stats.
        // I will add userId param.

        return { store, thumbnail };
    }

    /**
     * (사용자) 가게 요약 정보 조회 (Bottom Sheet용)
     * @param id 가게 ID
     * @param userId 사용자 ID (선택)
     * @param lat 위도 (거리 계산용, 선택)
     * @param lng 경도 (거리 계산용, 선택)
     * @returns AI 득템 지수, 나의 랭킹, 방문 통계 등을 포함한 가게 요약 정보
     */
    async findStoreSummaryWithUser(id: number, userId?: number, lat?: number, lng?: number) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['photos', 'openingHours', 'type', 'analytics']
        });
        if (!store) throw new NotFoundException('존재하지 않는 가게입니다.');

        const thumbnail = store.photos.find(p => p.type === 'cover')?.imageName || store.photos[0]?.imageName || null;

        // 1. 영업 상태 계산
        const businessStatus = this.calculateBusinessStatus(store.openingHours);

        // 2. 거리 계산 (선택적)
        let distance: number | undefined = undefined;
        if (lat && lng) {
            distance = this.calculateDistance(lat, lng, Number(store.latitude), Number(store.longitude));
        }

        // 3. myStatus 조회
        let myStatus: UserStoreResult.MyStoreStatusDto;
        if (userId) {
            const stat = await this.userStoreStatsRepository.findOne({ where: { userId, storeId: id } });

            // 해당 가게와 관련된 stamps 조회
            const userStamps = await this.userStampRepository.find({
                where: { userId },
                relations: ['stamp', 'stamp.store']
            });
            const storeStamps = userStamps
                .filter(us => us.stamp?.store?.id === id)
                .map(us => new UserStoreResult.StampDto(us.stampId, us.stamp.imageName, us.acquiredAt));

            if (stat) {
                myStatus = new UserStoreResult.MyStoreStatusDto(
                    stat.visitCount,
                    stat.lootCount,
                    stat.isScrapped,
                    stat.tier,
                    storeStamps
                );
            } else {
                myStatus = new UserStoreResult.MyStoreStatusDto(0, 0, false, 'unknown', storeStamps);
            }
        } else {
            myStatus = new UserStoreResult.MyStoreStatusDto(0, 0, false, 'unknown', []);
        }

        // 4. 최근 24시간 내 득템 인증 조회 (최대 4개)
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        const recentCertifications = await this.certificationRepository.find({
            where: {
                store: { id },
                type: 'loot',
                occurredAt: MoreThan(yesterday)
            },
            relations: ['photos', 'user'],
            order: { occurredAt: 'DESC' },
            take: 4
        });

        const recentLoots = recentCertifications.map(cert => {
            const photoUrl = cert.photos && cert.photos.length > 0 ? cert.photos[0].imageName : '';
            return new UserStoreResult.RecentLootDto(
                cert.id,
                photoUrl,
                cert.occurredAt,
                cert.user?.nickname || '알 수 없음'
            );
        });

        // 5. AI 득템 지수 추가
        const successProb = store.analytics?.successProb ?? 50;
        const successLevel = this.getSuccessLevel(successProb);

        // 6. 나의 랭킹 계산 (해당 가게 방문자 중 내 순위)
        let myRanking: number | undefined;
        if (userId) {
            myRanking = await this.calculateUserRanking(id, userId);
        }

        // 7. 응답 DTO 생성
        return new UserStoreResult.StoreSummaryExtendedDto(
            {
                id: store.id,
                name: store.name,
                address: store.address,
                category: store.type?.name || null,
                latitude: Number(store.latitude),
                longitude: Number(store.longitude),
                distance,
                thumbnailUrl: thumbnail
            },
            businessStatus,
            myStatus,
            recentLoots,
            successProb,
            successLevel,
            myRanking
        );
    }

    /**
     * 득템 지수를 레벨 문자열로 변환
     * @param prob 득템 확률 (0-100)
     * @returns '매우 높음', '높음', '보통', '낮음', '매우 낮음'
     */
    private getSuccessLevel(prob: number): string {
        if (prob >= 80) return '매우 높음';
        if (prob >= 60) return '높음';
        if (prob >= 40) return '보통';
        if (prob >= 20) return '낮음';
        return '매우 낮음';
    }

    /**
     * 나의 랭킹 계산 (lootCount 기준)
     * @param storeId 가게 ID
     * @param userId 사용자 ID
     * @returns 해당 가게에서 사용자의 득템 랭킹 (1위부터 시작)
     */
    private async calculateUserRanking(storeId: number, userId: number): Promise<number> {
        const userStat = await this.userStoreStatsRepository.findOne({
            where: { storeId, userId }
        });

        if (!userStat) return 0;

        const ranking = await this.userStoreStatsRepository
            .createQueryBuilder('uss')
            .where('uss.storeId = :storeId', { storeId })
            .andWhere('uss.lootCount > :lootCount', { lootCount: userStat.lootCount })
            .getCount();

        return ranking + 1;
    }

    // 영업 상태 계산 헬퍼 메서드
    private calculateBusinessStatus(openingHours: any[]): 'open' | 'closed' | 'unknown' {
        if (!openingHours || openingHours.length === 0) return 'unknown';

        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sunday, 1=Monday, ...
        const currentTime = now.toTimeString().substring(0, 5); // HH:MM

        const todayHours = openingHours.find(h => h.dayOfWeek === dayOfWeek);
        if (!todayHours) return 'unknown';
        if (todayHours.isClosed) return 'closed';

        if (todayHours.openTime && todayHours.closeTime) {
            if (currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime) {
                return 'open';
            } else {
                return 'closed';
            }
        }

        return 'unknown';
    }

    // Haversine 거리 계산 헬퍼 메서드
    private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371000; // 지구 반지름 (미터)
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }

    private toRad(value: number): number {
        return value * Math.PI / 180;
    }

    async toggleScrap(storeId: number, userId: number) {
        let stat = await this.userStoreStatsRepository.findOne({
            where: { userId, storeId }
        });

        if (!stat) {
            stat = this.userStoreStatsRepository.create({
                userId,
                storeId,
                isScrapped: true
            });
        } else {
            stat.isScrapped = !stat.isScrapped;
        }
        return await this.userStoreStatsRepository.save(stat);
    }

    /**
     * (사용자) 가게 상세 정보 조회 (확장 버전)
     * @param id 가게 ID
     * @param userId 사용자 ID (선택)
     * @returns AI 분석, 퀘스트 정보, 시설 정보, 운영 시간, 리뷰 등을 포함한 가게 상세 정보
     */
    async findStoreDetailExtended(id: number, userId?: number): Promise<UserStoreResult.StoreDetailExtendedDto> {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['openingHours', 'facilities', 'photos', 'type', 'analytics']
        });

        if (!store) throw new NotFoundException('존재하지 않는 가게입니다.');

        // 1. 기본 정보 구성
        const storeInfo = {
            id: store.id,
            name: store.name,
            address: store.address,
            latitude: Number(store.latitude),
            longitude: Number(store.longitude),
            phone: store.phone,
            category: store.type?.name || null,
            region1: store.region1,
            region2: store.region2
        };

        // 2. [AI] 분석 데이터
        const analytics = store.analytics ? new UserStoreResult.StoreAnalyticsDto(
            store.analytics.successProb,
            this.getSuccessLevel(store.analytics.successProb),
            store.analytics.recentLootCount,
            this.parseHotTimeData(store.analytics.hotTimeJson),
            this.getBestTimeMessage(store.analytics.hotTimeJson)
        ) : null;

        // 3. [Game] 퀘스트 정보 조회
        const availableQuests = await this.questService.getAvailableQuests(store, userId);

        // 4. [Original] 시설 정보
        const facilities = store.facilities ? new UserStoreResult.StoreFacilitiesDto(
            store.facilities.machineCount,
            this.translatePaymentMethods(store.facilities.paymentMethods),
            store.facilities.notes
        ) : null;

        // 5. 운영 시간
        const openingHours = this.formatOpeningHours(store.openingHours);

        // 6. 영업 상태
        const businessStatus = this.calculateBusinessStatus(store.openingHours);

        // 7. 사진
        const photos = store.photos.map(p => new UserStoreResult.StorePhotoDto(
            p.id,
            p.type,
            p.imageName
        ));

        // 8. 최근 리뷰
        const recentReviews = await this.getRecentReviews(id, 5);

        // 9. 나의 상태 (로그인 시)
        let myStatus: UserStoreResult.MyStoreStatusDto | undefined;
        if (userId) {
            myStatus = await this.getMyStoreStatus(id, userId);
        }

        return new UserStoreResult.StoreDetailExtendedDto(
            storeInfo,
            analytics,
            availableQuests,
            facilities,
            openingHours,
            businessStatus,
            photos,
            recentReviews,
            myStatus
        );
    }

    /**
     * (사용자) 가게 인증샷 갤러리 조회
     * @param storeId 가게 ID
     * @param page 페이지 번호 (기본값: 1)
     * @param size 페이지 크기 (기본값: 20)
     * @param sort 정렬 방식 ('recent' | 'popular', 기본값: 'recent')
     * @returns 페이지네이션된 득템 인증샷 목록
     */
    async getStoreGallery(
        storeId: number,
        page: number = 1,
        size: number = 20,
        sort: 'recent' | 'popular' = 'recent'
    ): Promise<UserStoreResult.StoreGalleryDto> {
        const qb = this.certificationRepository
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.photos', 'cp')
            .leftJoinAndSelect('c.user', 'u')
            .where('c.storeId = :storeId', { storeId })
            .andWhere('c.type = :type', { type: 'loot' });

        if (sort === 'recent') {
            qb.orderBy('c.occurredAt', 'DESC');
        } else if (sort === 'popular') {
            // 좋아요 수가 없으면 일단 최신순으로 정렬
            qb.orderBy('c.occurredAt', 'DESC');
        }

        const total = await qb.getCount();
        const certifications = await qb
            .skip((page - 1) * size)
            .take(size)
            .getMany();

        const data = certifications.map(cert => {
            const photoUrl = cert.photos && cert.photos.length > 0 ? cert.photos[0].imageName : '';
            return new UserStoreResult.StoreGalleryItemDto(
                cert.id,
                photoUrl,
                cert.occurredAt,
                cert.user?.nickname || '알 수 없음',
                cert.user?.profileImageName || null,
                0 // likeCount는 나중에 구현
            );
        });

        return new UserStoreResult.StoreGalleryDto(
            true,
            data,
            { page, size, total }
        );
    }

    /**
     * 최근 리뷰 조회
     * @param storeId 가게 ID
     * @param limit 조회할 리뷰 개수
     * @returns 최근 리뷰 목록
     */
    private async getRecentReviews(storeId: number, limit: number): Promise<ReviewResult.ReviewDto[]> {
        const reviews = await this.reviewRepository.find({
            where: { store: { id: storeId } },
            relations: ['user', 'store'],
            take: limit,
            order: { createdAt: 'DESC' }
        });

        return reviews.map(review => new ReviewResult.ReviewDto(
            review.id,
            review.rating,
            review.content,
            review.images ?? [],
            new AuthResult.UserInfo(review.user),
            new ReviewResult.StoreInfoDto(
                review.store.id,
                review.store.name,
                review.store.address
            ),
            review.createdAt,
            review.updatedAt
        ));
    }

    /**
     * 나의 가게 상태 조회
     * @param storeId 가게 ID
     * @param userId 사용자 ID
     * @returns 방문 횟수, 득템 횟수, 스크랩 여부, 티어, 획득 도장 등의 정보
     */
    private async getMyStoreStatus(storeId: number, userId: number): Promise<UserStoreResult.MyStoreStatusDto> {
        const stat = await this.userStoreStatsRepository.findOne({
            where: { userId, storeId }
        });

        const userStamps = await this.userStampRepository.find({
            where: { userId },
            relations: ['stamp', 'stamp.store']
        });

        const storeStamps = userStamps
            .filter(us => us.stamp?.store?.id === storeId)
            .map(us => new UserStoreResult.StampDto(
                us.stampId,
                us.stamp.imageName,
                us.acquiredAt
            ));

        if (stat) {
            return new UserStoreResult.MyStoreStatusDto(
                stat.visitCount,
                stat.lootCount,
                stat.isScrapped,
                stat.tier,
                storeStamps
            );
        }

        return new UserStoreResult.MyStoreStatusDto(0, 0, false, 'unknown', storeStamps);
    }

    /**
     * hotTimeJson 파싱
     * @param hotTimeJson StoreAnalytics의 hotTimeJson 원본 데이터
     * @returns 시간대별 득템 확률 배열
     */
    private parseHotTimeData(hotTimeJson: any): UserStoreResult.HotTimeSlotDto[] {
        if (!hotTimeJson || !Array.isArray(hotTimeJson)) {
            return [];
        }

        return hotTimeJson.map(slot => new UserStoreResult.HotTimeSlotDto(
            slot.hour || 0,
            slot.probability || 0
        ));
    }

    /**
     * 시간대별 최적 시간 메시지 생성
     * @param hotTimeJson StoreAnalytics의 hotTimeJson 원본 데이터
     * @returns "오후 7시~9시가 기회입니다!" 형식의 추천 메시지
     */
    private getBestTimeMessage(hotTimeJson: any): string {
        if (!hotTimeJson || !Array.isArray(hotTimeJson) || hotTimeJson.length === 0) {
            return '데이터 수집 중입니다.';
        }

        const sorted = [...hotTimeJson].sort((a, b) => (b.probability || 0) - (a.probability || 0));
        const best = sorted[0];

        if (!best || (best.probability || 0) < 30) {
            return '현재 데이터가 부족합니다.';
        }

        const hour = best.hour || 0;
        const period = hour < 12 ? '오전' : (hour < 18 ? '오후' : '저녁');
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

        return `${period} ${displayHour}시~${displayHour + 2}시가 기회입니다!`;
    }

    /**
     * 결제 방법 한글 변환
     * @param methods StoreFacility의 paymentMethods 배열 (예: ['cash', 'card', 'qr'])
     * @returns 한글 변환된 결제 방법 배열 (예: ['현금', '카드', 'QR결제'])
     */
    private translatePaymentMethods(methods: string[] | null): string[] {
        if (!methods) return [];

        const translations: Record<string, string> = {
            'cash': '현금',
            'card': '카드',
            'qr': 'QR결제'
        };

        return methods.map(m => translations[m] || m);
    }

    /**
     * 운영 시간 포맷팅
     * @param openingHours StoreOpeningHours 엔티티 배열
     * @returns 요일명(한글)을 포함한 운영 시간 DTO 배열
     */
    private formatOpeningHours(openingHours: any[]): UserStoreResult.OpeningHoursDto[] {
        if (!openingHours) return [];

        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

        return openingHours.map(h => new UserStoreResult.OpeningHoursDto(
            h.dayOfWeek,
            dayNames[h.dayOfWeek] || '알 수 없음',
            h.openTime || '',
            h.closeTime || '',
            h.isClosed || false
        ));
    }
}
