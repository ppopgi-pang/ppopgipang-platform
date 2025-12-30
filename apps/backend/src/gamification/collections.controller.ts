import { Controller, Get, Patch, Query, Param, Body, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiQuery,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CollectionResult } from '@ppopgipang/types';
import { IsInt, IsOptional } from 'class-validator';

// Request DTO (validation용, Controller 내부에만 존재)
class SetFeaturedBadgeRequestDto {
    @IsOptional()
    @IsInt()
    achievementId?: number | null;
}

@ApiTags('[Gamification] 수집(Collection)')
@Controller('v1/gamification/collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) { }

    @Get('passport')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: '(사용자) 여권 메인 조회',
        description: '사용자의 방문 기록, 스탬프, 지역별 정복률, 통계를 조회합니다.'
    })
    @ApiQuery({ name: 'limit', required: false, description: '스탬프 최대 개수', example: 100 })
    @ApiQuery({ name: 'regionLimit', required: false, description: '표시할 지역 개수', example: 10 })
    @ApiOkResponse({
        type: CollectionResult.PassportDto,
        description: '여권 메인 조회 성공'
    })
    getPassport(
        @Req() req: any,
        @Query('limit') limit?: number,
        @Query('regionLimit') regionLimit?: number
    ) {
        return this.collectionsService.getPassport(
            req.user.userId,
            limit ? Number(limit) : 100,
            regionLimit ? Number(regionLimit) : 10
        );
    }

    @Get('loots')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: '(사용자) 득템 갤러리 조회',
        description: '사용자가 획득한 득템(성공 인증) 이미지 갤러리를 조회합니다.'
    })
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 1 })
    @ApiQuery({ name: 'size', required: false, description: '페이지 크기', example: 30 })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['recent', 'oldest'], description: '정렬 방식', example: 'recent' })
    @ApiQuery({ name: 'storeId', required: false, description: '특정 가게 필터링' })
    @ApiOkResponse({
        type: CollectionResult.LootGalleryDto,
        description: '득템 갤러리 조회 성공'
    })
    getLootGallery(
        @Req() req: any,
        @Query('page') page?: number,
        @Query('size') size?: number,
        @Query('sortBy') sortBy?: string,
        @Query('storeId') storeId?: number
    ) {
        return this.collectionsService.getLootGallery(
            req.user.userId,
            page ? Number(page) : 1,
            size ? Number(size) : 30,
            sortBy || 'recent',
            storeId ? Number(storeId) : undefined
        );
    }

    @Get('loots/:certificationId')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: '(사용자) 득템 상세 조회',
        description: '특정 득템의 상세 정보를 조회합니다.'
    })
    @ApiParam({ name: 'certificationId', description: '인증 ID' })
    @ApiOkResponse({
        type: CollectionResult.LootDetailDto,
        description: '득템 상세 조회 성공'
    })
    getLootDetail(
        @Req() req: any,
        @Param('certificationId', ParseIntPipe) certificationId: number
    ) {
        return this.collectionsService.getLootDetail(req.user.userId, certificationId);
    }

    @Get('achievements')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: '(사용자) 업적/배지 현황 조회',
        description: '사용자의 업적 및 배지 현황을 조회합니다.'
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: ['all', 'unlocked', 'locked'],
        description: '필터링 상태',
        example: 'all'
    })
    @ApiOkResponse({
        type: CollectionResult.AchievementsDto,
        description: '업적/배지 현황 조회 성공'
    })
    getAchievements(
        @Req() req: any,
        @Query('status') status?: string
    ) {
        return this.collectionsService.getAchievements(req.user.userId, status);
    }

    @Patch('achievements/featured')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: '(사용자) 대표 배지 설정/해제',
        description: '대표 배지를 설정하거나 해제합니다. achievementId를 null로 보내면 해제됩니다.'
    })
    @ApiBody({ type: SetFeaturedBadgeRequestDto })
    @ApiOkResponse({
        type: CollectionResult.SetFeaturedBadgeDto,
        description: '대표 배지 설정 성공'
    })
    setFeaturedBadge(
        @Req() req: any,
        @Body() dto: SetFeaturedBadgeRequestDto
    ) {
        return this.collectionsService.setFeaturedBadge(req.user.userId, dto.achievementId || null);
    }
}
