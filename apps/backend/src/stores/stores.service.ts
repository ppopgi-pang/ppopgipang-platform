import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Like, Repository } from 'typeorm';
import { AdminStoreInput, AuthResult, ReviewResult, StoreTypeInput, UserStoreResult } from '@ppopgipang/types';
import { StoreType } from './entities/store-type.entity';
import { Review } from 'src/reviews/entities/review.entity';


@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(StoreType)
        private readonly storeTypeRepository: Repository<StoreType>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) { }

    async findStoreDetail(id: number) {

        const store = await this.storeRepository.findOneBy({ id });

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
            review.images ? review.images.map(image => `http://localhost:3000/public/review/${image}`) : [],
            new AuthResult.UserInfo(review.user),
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
    async searchStore(keyword: string, page: number, size: number) {
        const [stores, total] = await this.storeRepository.findAndCount({
            where: { name: Like(`%${keyword}%`) },
            take: size,
            skip: (page - 1) * size,
            order: { name: 'ASC' }
        });

        return new UserStoreResult.SearchDto(true, stores, { count: total });
    }
}
