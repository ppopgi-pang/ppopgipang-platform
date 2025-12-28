import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StoresService } from './stores.service';
import { AdminStoreInput, StoreTypeInput } from '@ppopgipang/types';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsAdmin } from 'src/auth/decorators/is-admin.decorator';
import { IgnoreJwtGuard } from 'src/auth/decorators/ignore-jwt-guard.decorator';

@ApiTags('[Store] 가게')
@Controller('v1/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  /**
   * (사용자) 가게 목록 - 반경 검색
   * @param latitude 
   * @param longitude 
   * @param radius 
   * @param page 
   * @param size 
   * @param keyword 
   * @returns 
   */
  @Get('nearby')
  @IgnoreJwtGuard()
  @ApiOperation({
    summary: '(사용자) 가게 목록 - 반경 검색'
  })
  @ApiQuery({ name: 'latitude', required: true, description: '위도' })
  @ApiQuery({ name: 'longitude', required: true, description: '경도' })
  @ApiQuery({ name: 'radius', required: false, description: '검색 반경' })
  @ApiQuery({ name: 'page', required: false, description: '페이지' })
  @ApiQuery({ name: 'size', required: false, description: '한번에 가져올 콘텐츠 수' })
  @ApiQuery({ name: 'keyword', required: false, description: '검색 키워드' })
  findNearByStores(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.storesService.findNearByStores(
      latitude,
      longitude,
      radius,
      page,
      size,
      keyword
    );
  }

  /**
   * (사용자) 뷰포트(바운드) 검색
   * @param north 
   * @param south 
   * @param east 
   * @param west 
   * @param keyword 
   * @returns 
   */
  @Get('in-bounds')
  @IgnoreJwtGuard()
  @ApiOperation({
    summary: '(사용자) 가게 목록 - 뷰포트(바운드) 검색'
  })
  @ApiQuery({ name: 'north', required: true, description: '북쪽 위도 경계' })
  @ApiQuery({ name: 'south', required: true, description: '남쪽 위도 경계' })
  @ApiQuery({ name: 'east', required: true, description: '동쪽 경도 경계' })
  @ApiQuery({ name: 'west', required: true, description: '서쪽 경도 경계' })
  @ApiQuery({ name: 'keyword', required: false, description: '검색 키워드' })
  searchInBounds(
    @Query('north') north: number,
    @Query('south') south: number,
    @Query('east') east: number,
    @Query('west') west: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.storesService.searchInBounds(north, south, east, west, keyword);
  }

  /**
   * (어드민) 가게 생성 API
   * @param dto 
   * @returns 
   */
  @Post()
  @IsAdmin(true)
  @ApiOperation({
    summary: '(어드민) 가게 생성'
  })
  @ApiBody({ type: AdminStoreInput.CreateStoreDto })
  createStore(
    @Body() dto: AdminStoreInput.CreateStoreDto
  ) {
    return this.storesService.createStore(dto);
  }

  /**
   * (사용자) 가게 검색 API
   */
  @Get('search')
  @IgnoreJwtGuard()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 가게 검색 API'
  })
  @ApiQuery({ name: 'keyword', required: true, description: '검색 키워드' })
  @ApiQuery({ name: 'lat', required: false, description: '위도 (거리순 정렬용)' })
  @ApiQuery({ name: 'lng', required: false, description: '경도 (거리순 정렬용)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1 })
  @ApiQuery({ name: 'size', required: false, description: '한번에 가져올 콘텐츠 수', example: 20 })
  searchStore(
    @Query('keyword') keyword: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 20,
    @Req() req?: any
  ) {
    const userId = req?.user?.userId;
    return this.storesService.searchStore(keyword, lat, lng, page, size, userId);
  }

  @Get(':id/summary')
  @IgnoreJwtGuard()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 가게 요약 정보 (시트용)'
  })
  getStoreSummary(
    @Param('id') id: number,
    @Req() req?: any
  ) {
    const userId = req?.user?.userId;
    return this.storesService.findStoreSummaryWithUser(id, userId);
  }

  @Post(':id/scrap')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '(사용자) 가게 스크랩 토글'
  })
  toggleScrap(
    @Param('id') id: number,
    @Req() req: any
  ) {
    return this.storesService.toggleScrap(id, req.user.userId);
  }

  /**
   * (사용자) 가게 상세 정보 API
   * @param dto 
   * @returns 
   */
  @Get(':id')
  @IgnoreJwtGuard()
  @ApiOperation({
    summary: '(사용자) 가게 상세 정보 API'
  })
  findOneReview(
    @Param('id') id: number
  ) {
    return this.storesService.findStoreDetail(id);
  }

  /**
   * (어드민) 가게 타입(카테고리) 생성 API
   * @param dto 
   * @returns 
   */
  @Post('type')
  @IsAdmin(true)
  @ApiOperation({
    summary: '(어드민) 가게 타입(카테고리) 생성 API'
  })
  @ApiBody({ type: StoreTypeInput.CreateStoreTypeDto })
  createStoreType(
    @Body() dto: StoreTypeInput.CreateStoreTypeDto
  ) {
    return this.storesService.createStoreType(dto);
  }

  /**
   * (어드민) 가게 타입(카테고리) 목록 조회 API
   * @returns 
   */
  @Get('type')
  @IsAdmin(true)
  @ApiOperation({
    summary: '(어드민) 가게 타입(카테고리) 목록 조회 API'
  })
  findStoreTypes() {
    return this.storesService.findStoreTypes();
  }


}
