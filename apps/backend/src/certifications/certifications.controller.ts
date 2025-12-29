import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { OptionalAccess } from 'src/auth/decorators/optional-access.decorator';
import { IgnoreJwtGuard } from 'src/auth/decorators/ignore-jwt-guard.decorator';
import { CertificationsService } from './certifications.service';
import { IsArray, IsEnum, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CertificationResult } from '@ppopgipang/types';

// Request DTO with validators (for controller validation only)
class CreateLootRequestDto {
    @ApiProperty({ description: '가게 ID' })
    @IsInt()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({ description: '위도 (인증 당시 GPS)', required: false })
    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @ApiProperty({ description: '경도 (인증 당시 GPS)', required: false })
    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @ApiProperty({ description: '업로드된 이미지 파일명 배열 (1~3개)', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    photoFileNames: string[];

    @ApiProperty({ description: '선택한 태그 ID 배열', type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tagIds?: number[];

    @ApiProperty({ description: '한줄평 (프리셋 또는 직접 입력)', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    comment?: string;
}

class CreateCheckinRequestDto {
    @ApiProperty({ description: '가게 ID' })
    @IsInt()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({ description: '위도 (인증 당시 GPS)', required: false })
    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @ApiProperty({ description: '경도 (인증 당시 GPS)', required: false })
    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @ApiProperty({ description: '상태 평가', enum: ['good', 'normal', 'bad'] })
    @IsEnum(['good', 'normal', 'bad'])
    @IsNotEmpty()
    rating: 'good' | 'normal' | 'bad';

    @ApiProperty({ description: '선택한 이유 ID 배열', type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    reasonIds?: number[];
}

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
    @ApiOkResponse({ type: CertificationResult.LootGalleryDto, description: '득템 갤러리 조회 성공' })
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
    @ApiOkResponse({ type: CertificationResult.PresetsDto, description: '프리셋 조회 성공' })
    getPresets() {
        return this.certificationsService.getPresets();
    }

    @Post('loot')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '(사용자) 득템 인증 생성',
        description: '득템 인증을 생성하고 보상(EXP, 레벨, 스탬프, 배지)을 반환합니다. 먼저 /v1/commons/file-upload로 이미지를 업로드하고 받은 파일명을 photoFileNames에 담아 전송합니다.'
    })
    @ApiBody({ type: CreateLootRequestDto })
    @ApiCreatedResponse({ type: CertificationResult.CertificationResponseDto, description: '득템 인증 생성 성공' })
    createLoot(
        @Body() dto: CreateLootRequestDto,
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
    @ApiBody({ type: CreateCheckinRequestDto })
    @ApiCreatedResponse({ type: CertificationResult.CertificationResponseDto, description: '체크인 인증 생성 성공' })
    createCheckin(
        @Body() dto: CreateCheckinRequestDto,
        @Req() req: any
    ) {
        const userId = req.user.userId;
        return this.certificationsService.createCheckinCertification(userId, dto);
    }
}
