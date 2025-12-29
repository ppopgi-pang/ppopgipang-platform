import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OptionalAccess } from 'src/auth/decorators/optional-access.decorator';
import { CertificationsService } from './certifications.service';

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
}
