import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewBoard } from './entities/review-board.entity';
import { Review } from './entities/review.entity';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        ReviewBoard, Review, Store, User
      ])
    ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
