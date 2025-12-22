import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TradesService } from './trades.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TradeInput } from '@ppopgipang/types';

@ApiTags('[Trade] 중고거래')
@Controller('v1/trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) { }

  /**
   * (사용자) 중고거래 게시글 생성
   */
  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 중고거래 게시글 생성' })
  @ApiBody({ type: TradeInput.CreateTradeDto })
  createTrade(
    @Req() req: any,
    @Body() dto: TradeInput.CreateTradeDto
  ) {
    return this.tradesService.createTrade(req.user.userId, dto);
  }

  /**
   * (사용자) 중고거래 게시글 검색
   */
  @Get('search')
  @ApiOperation({ summary: '(사용자) 중고거래 게시글 검색' })
  @ApiQuery({ name: 'keyword', required: false, description: '검색어', example: '' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 10 })
  @ApiQuery({ name: 'size', required: false, description: '페이지 당 개수', example: 1 })
  searchTrade(
    @Query('keyword') keyword: string = '',
    @Query('page') page: number = 10,
    @Query('size') size: number = 1
  ) {
    return this.tradesService.searchTrade(keyword, page, size);
  }

  /**
   * (사용자) 중고거래 게시글 상세 조회
   */
  @Get(':id')
  @ApiOperation({ summary: '(사용자) 중고거래 게시글 상세 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  findOneTrade(
    @Param('id') id: number
  ) {
    return this.tradesService.findOneTrade(id);
  }

  /**
   * (사용자) 중고거래 게시글 수정
   */
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 중고거래 게시글 수정' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiBody({ type: TradeInput.UpdateTradeDto })
  updateTrade(
    @Param('id') id: number,
    @Body() dto: TradeInput.UpdateTradeDto
  ) {
    return this.tradesService.updateTrade(id, dto);
  }

  /**
   * (사용자) 중고거래 게시글 삭제
   */
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 중고거래 게시글 삭제' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  deleteTrade(
    @Req() req: any,
    @Param('id') id: number
  ) {
    return this.tradesService.deleteTrade(id, req.user.userId);
  }
}
