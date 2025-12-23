import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';



import { ReviewInput, ReviewResult, AuthResult } from '@ppopgipang/types';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import { join } from 'path';
import { rename } from 'fs/promises';
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

    async getMyReviews(userId: number, dto: ReviewInput.GetMyReviewsDto): Promise<ReviewResult.GetMyReviewsResultDto> {
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { user: { id: userId } },
            skip: (dto.page - 1) * dto.size,
            take: dto.size,
            relations: ['user', 'store'],
            order: { createdAt: 'DESC' }
        });

        return new ReviewResult.GetMyReviewsResultDto(
            reviews.map(review => ({
                id: review.id,
                rating: review.rating,
                content: review.content,
                images: review.images,
                user: new AuthResult.UserInfo(review.user),
                store: new ReviewResult.StoreInfoDto(
                    review.store.id,
                    review.store.name,
                    review.store.address
                ),
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            })),
            total
        );
    }
}
