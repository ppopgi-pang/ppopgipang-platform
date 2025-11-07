import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { AdminStoreInput, StoreTypeInput, UserStoreResult } from '@ppopgipang/types';
import { StoreType } from './entities/store-type.entity';


@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(StoreType)
        private readonly storeTypeRepository: Repository<StoreType>
    ) {}
    
    /**
     * (어드민) 가게 생성 메서드
     * @param dto
     * @returns 
     */
    async createStore(dto: AdminStoreInput.createStoreDto) {
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
                { keyword: `%${keyword}%`}
            );
        }

        const [data, total] = await qb.getManyAndCount();

        return new UserStoreResult.inBoundSearchDto(true, data, { count : total});
    }

    /**
     * (어드민) 가게 카테고리(타입) 생성 메서드
     * @param dto 
     * @returns 
     */
    async createStoreType(dto: StoreTypeInput.createStoreTypeDto) {
        return await this.storeTypeRepository.save(dto);
    }
}
