import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';



import { ReviewInput, ReviewResult, AuthResult } from '@ppopgipang/types';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import { join } from 'path';
import { rename, copyFile, unlink } from 'fs/promises';
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
                const sourcePath = join(tempFolder, name);
                const destPath = join(reviewFolder, name);

                try {
                    await rename(sourcePath, destPath);
                } catch (error: any) {
                    if (error.code === 'EXDEV') {
                        await copyFile(sourcePath, destPath);
                        await unlink(sourcePath);
                    } else {
                        throw error;
                    }
                }
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


    async findReviewsByStore(storeId: number, page: number, size: number, sort: 'latest' | 'rating') {
        const order = sort === 'rating' ? { rating: 'DESC' } : { createdAt: 'DESC' } as any;
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { store: { id: storeId } },
            skip: (page - 1) * size,
            take: size,
            relations: ['user', 'store'],
            order
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

    async findReviewStats(storeId: number) {
        const reviews = await this.reviewRepository.find({
            where: { store: { id: storeId } },
            select: ['rating']
        });

        const total = reviews.length;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;

        const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => {
            const rInt = Math.floor(r.rating); // Assuming integer ratings mostly
            if (ratingDistribution[rInt] !== undefined) {
                ratingDistribution[rInt]++;
            }
        });

        return new ReviewResult.ReviewStatsDto(averageRating, ratingDistribution);
    }
}
