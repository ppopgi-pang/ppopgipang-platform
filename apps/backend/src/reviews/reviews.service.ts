import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

import { ReviewInput } from '@ppopgipang/types';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import { join } from 'path';
import { rename } from 'fs/promises';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,

        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
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

        const publicUploadDir = this.configService.getOrThrow<string>('PUBLIC_UPLOAD_DIR');
        const reviewFolder = join(publicUploadDir, 'review');
        const tempFolder = join(publicUploadDir, 'temp');

        if (dto.images) {
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
