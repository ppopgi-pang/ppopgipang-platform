import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { AdminStore } from '@ppopgipang/types';


@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
    ) {}

    async create(dto: AdminStore.createDto) {
        return await this.storeRepository.save(dto);
    }
}
