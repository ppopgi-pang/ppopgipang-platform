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
        private readonly usersService: UsersService
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

    // Helper to be used by controller which will construct DTO
    async findStoreSummaryWithUser(id: number, userId?: number, lat?: number, lng?: number) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['photos', 'openingHours', 'type']
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

        // 5. 응답 DTO 생성
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
            recentLoots
        );
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
}
