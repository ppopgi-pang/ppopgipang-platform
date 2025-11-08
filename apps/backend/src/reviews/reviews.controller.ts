import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { ReviewInput } from '@ppopgipang/types';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 리뷰 생성'
  })
  @ApiBody({ type: ReviewInput.CreateReviewDto })
  createReview(
    @Req() req: any,
    @Body() dto: ReviewInput.CreateReviewDto
  ) {
    return this.reviewsService.createReview(dto, req.user.userId)
  }
}
