import { Body, Controller, Post, Req, UseGuards, Get, Query } from '@nestjs/common';
import { IgnoreJwtGuard } from 'src/auth/decorators/ignore-jwt-guard.decorator';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { ReviewInput, ReviewResult } from '@ppopgipang/types';
import { ApiBody, ApiOperation, ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('[Review] 리뷰(후기)')
@Controller('v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Get()
  @IgnoreJwtGuard()
  @ApiOperation({
    summary: '(사용자) 특정 가게 리뷰 리스트 조회'
  })
  @ApiOkResponse({ type: [ReviewResult.ReviewDto], description: '리뷰 리스트 조회 성공' })
  getReviews(
    @Query('storeId') storeId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: 'latest' | 'rating' = 'latest'
  ) {
    return this.reviewsService.findReviewsByStore(storeId, page, limit, sort);
  }

  @Get('stats')
  @IgnoreJwtGuard()
  @ApiOperation({
    summary: '(사용자) 가게 리뷰 통계 조회'
  })
  @ApiOkResponse({ type: ReviewResult.ReviewStatsDto, description: '리뷰 통계 조회 성공' })
  getReviewStats(@Query('storeId') storeId: number) {
    return this.reviewsService.findReviewStats(storeId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 리뷰 생성'
  })
  @ApiBody({ type: ReviewInput.CreateReviewDto })
  @ApiCreatedResponse({ type: ReviewResult.ReviewDto, description: '리뷰 생성 성공' })
  createReview(
    @Req() req: any,
    @Body() dto: ReviewInput.CreateReviewDto
  ) {
    return this.reviewsService.createReview(dto, req.user.userId)
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 내 리뷰 목록 조회'
  })
  @ApiOkResponse({ type: ReviewResult.GetMyReviewsResultDto, description: '내 리뷰 목록 조회 성공' })
  async getMyReviews(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const dto = new ReviewInput.GetMyReviewsDto();
    dto.page = page;
    dto.size = size;
    return this.reviewsService.getMyReviews(req.user.userId, dto);
  }
}
