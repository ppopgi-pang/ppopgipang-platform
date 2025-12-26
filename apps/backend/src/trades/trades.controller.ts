import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TradesService } from './trades.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TradeChatInput, TradeInput } from '@ppopgipang/types';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwt-optional.guard';
import { IgnoreJwtGuard } from 'src/auth/decorators/ignore-jwt-guard.decorator';

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
  @IgnoreJwtGuard()
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
   * (사용자) 채팅방 생성
   */
  @Post('chat-room')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 채팅방 생성' })
  @ApiBody({ type: TradeChatInput.CreateTradeChatRoomDto })
  createChatRoom(
    @Req() req: any,
    @Body() dto: TradeChatInput.CreateTradeChatRoomDto
  ) {
    return this.tradesService.createChatRoom(req.user.userId, dto);
  }

  /**
   * (사용자) 내 채팅방 목록 조회
   */
  @Get('chat-room')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 내 채팅방 목록 조회' })
  getMyChatRooms(
    @Req() req: any
  ) {
    return this.tradesService.getMyTradeChatRooms(req.user.userId);
  }

  /**
   * (사용자) 채팅방 나가기
   */
  @Delete('chat-room/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 채팅방 나가기' })
  @ApiParam({ name: 'id', description: '채팅방 ID' })
  leaveChatRoom(
    @Req() req: any,
    @Param('id') id: number
  ) {
    return this.tradesService.leaveChatRoom(id, req.user.userId);
  }

  /**
   * (사용자) 채팅 메시지 전송
   */
  @Post('chat-room/message')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 채팅 메시지 전송' })
  @ApiBody({ type: TradeChatInput.CreateTradeChatMessageDto })
  createChatMessage(
    @Req() req: any,
    @Body() dto: TradeChatInput.CreateTradeChatMessageDto
  ) {
    return this.tradesService.createChatMessage(req.user.userId, dto);
  }

  /**
   * (사용자) 채팅 메시지 목록 조회
   */
  @Get('chat-room/:chatRoomId/messages')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '(사용자) 채팅 메시지 목록 조회' })
  @ApiParam({ name: 'chatRoomId', description: '채팅방 ID' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 1 })
  @ApiQuery({ name: 'size', required: false, description: '페이지 당 개수', example: 20 })
  findAllChatMessages(
    @Req() req: any,
    @Param('chatRoomId') chatRoomId: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 20
  ) {
    return this.tradesService.findAllChatMessages(req.user.userId, chatRoomId, page, size);
  }

  /**
   * (사용자) 중고거래 게시글 상세 조회
   */

  @Get(':id')
  @IgnoreJwtGuard()
  @UseGuards(JwtOptionalAuthGuard)
  @ApiOperation({ summary: '(사용자) 중고거래 게시글 상세 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  findOneTrade(
    @Req() req: any,
    @Param('id') id: number
  ) {
    return this.tradesService.findOneTrade(id, req.user?.userId);
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

