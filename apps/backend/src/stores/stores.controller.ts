import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { AdminStoreInput, StoreTypeInput } from '@ppopgipang/types';
import { ApiQuery } from '@nestjs/swagger';

@Controller('v1/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

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
  createStore(
    @Body() dto: AdminStoreInput.createStoreDto
  ) {
    return this.storesService.createStore(dto);
  }

  /**
   * (어드민) 가게 타입(카테고리) 생성 API
   * @param dto 
   * @returns 
   */
  @Post('type')
  createStoreType(
    @Body() dto: StoreTypeInput.createStoreTypeDto
  ) {
    return this.storesService.createStoreType(dto);
  }

  
}
