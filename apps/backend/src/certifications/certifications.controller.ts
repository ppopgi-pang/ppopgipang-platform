import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OptionalAccess } from 'src/auth/decorators/optional-access.decorator';
import { IgnoreJwtGuard } from 'src/auth/decorators/ignore-jwt-guard.decorator';
import { CertificationsService } from './certifications.service';
import { CreateLootDto } from './dto/create-loot.dto';
import { CreateCheckinDto } from './dto/create-checkin.dto';

@ApiTags('[Certification] 득템/체크인 인증')
@Controller('v1/certifications')
export class CertificationsController {
    constructor(private readonly certificationsService: CertificationsService) { }

    @Get('loots')
    @OptionalAccess()
    @ApiOperation({
        summary: '(사용자) 득템 갤러리 조회'
    })
    @ApiQuery({ name: 'storeId', required: true, description: '가게 ID' })
    @ApiQuery({ name: 'sort', required: false, description: '정렬 (latest | popular)', example: 'latest' })
    @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1 })
    @ApiQuery({ name: 'size', required: false, description: '한번에 가져올 콘텐츠 수', example: 20 })
    getLootGallery(
        @Query('storeId') storeId: number,
        @Query('sort') sort: 'latest' | 'popular' = 'latest',
        @Query('page') page: number = 1,
        @Query('size') size: number = 20,
        @Req() req?: any
    ) {
        const userId = req?.user?.userId;
        return this.certificationsService.getLootGallery(storeId, sort, page, size, userId);
    }

    @Get('presets')
    @IgnoreJwtGuard()
    @ApiOperation({
        summary: '(사용자) 태그 및 프리셋 조회',
        description: '득템 태그, 한줄평 프리셋, 체크인 이유 프리셋 전체 조회'
    })
    getPresets() {
        return this.certificationsService.getPresets();
    }

    @Post('loot')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '(사용자) 득템 인증 생성',
        description: '득템 인증을 생성하고 보상(EXP, 레벨, 스탬프, 배지)을 반환합니다.'
    })
    @ApiBody({ type: CreateLootDto })
    createLoot(
        @Body() dto: CreateLootDto,
        @Req() req: any
    ) {
        const userId = req.user.userId;
        return this.certificationsService.createLootCertification(userId, dto);
    }

    @Post('checkin')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '(사용자) 체크인 인증 생성',
        description: '체크인 인증을 생성하고 보상(EXP, 레벨, 스탬프, 배지)을 반환합니다.'
    })
    @ApiBody({ type: CreateCheckinDto })
    createCheckin(
        @Body() dto: CreateCheckinDto,
        @Req() req: any
    ) {
        const userId = req.user.userId;
        return this.certificationsService.createCheckinCertification(userId, dto);
    }
}
