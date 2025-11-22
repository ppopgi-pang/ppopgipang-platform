import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { AdminStoreInput, StoreTypeInput } from '@ppopgipang/types';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('[Store] 가게')
@Controller('v1/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('nearby')
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
   * (어드민) 가게 타입(카테고리) 생성 API
   * @param dto 
   * @returns 
   */
  @Post('type')
  @ApiOperation({
    summary: '(어드민) 가게 타입(카테고리) 생성 API'
  })
  @ApiBody({ type: StoreTypeInput.CreateStoreTypeDto })
  createStoreType(
    @Body() dto: StoreTypeInput.CreateStoreTypeDto
  ) {
    return this.storesService.createStoreType(dto);
  }

  
}
