import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

import { ReviewInput } from '@ppopgipang/types';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import { join } from 'path';
import { rename, mkdir } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,

        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async createReview(dto: ReviewInput.CreateReviewDto, userId: number) {
        const user = await this.userRepository.findOneBy({ 'id': userId });
        if (!user) throw new BadRequestException('요청한 유저가 존재하지 않습니다.');
        const store = await this.storeRepository.findOneBy({ 'id': dto.storeId });
        if (!store) throw new BadRequestException('요청한 가게가 존재하지 않습니다.');

        const newReview = this.reviewRepository.create({
            rating: dto.rating,
            content: dto.content,
            images: dto.images,
            store,
            user
        });

        const reviewFolder = join(process.cwd(), 'public', 'review');
        const tempFolder = join(process.cwd(), 'public', 'temp');

        if (dto.images && dto.images.length > 0) {
            // Ensure review folder exists
            if (!existsSync(reviewFolder)) {
                mkdirSync(reviewFolder, { recursive: true });
            }

            for (let name of dto.images) {
                await rename(
                    join(tempFolder, name),
                    join(reviewFolder, name)
                );
            }
        }

        return await this.reviewRepository.save(newReview);
    }
}
