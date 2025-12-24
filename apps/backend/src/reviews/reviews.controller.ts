import { Body, Controller, Post, Req, UseGuards, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { ReviewInput } from '@ppopgipang/types';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('[Review] 리뷰(후기)')
@Controller('v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

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

  @Get('my')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 내 리뷰 목록 조회'
  })
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
