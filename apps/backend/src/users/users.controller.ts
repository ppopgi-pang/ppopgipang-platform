import { Controller, Get, Req, UseGuards, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserResult, UserSearchHistory } from '@ppopgipang/types';

@ApiTags('[User] 사용자')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({
    summary: '(사용자) 사용자 정보 조회'
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserResult.UserInfo, description: '사용자 정보 조회 성공' })
  getUserInfo(@Req() req: any) {
    return this.usersService.getUserInfo(req.user.userId);
  }

  @Get('me/search-history')
  @ApiOperation({
    summary: '(사용자) 내 최근 검색어 조회'
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: [UserSearchHistory.SearchHistoryDto], description: '내 최근 검색어 조회 성공' })
  getSearchHistory(@Req() req: any) {
    return this.usersService.getSearchHistory(req.user.userId);
  }

  @Delete('me/search-history/:id')
  @ApiOperation({
    summary: '(사용자) 특정 검색 기록 삭제'
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: Boolean, description: '특정 검색 기록 삭제 성공' })
  deleteSearchHistory(
    @Req() req: any,
    @Param('id') id: number
  ) {
    return this.usersService.deleteSearchHistory(req.user.userId, id);
  }

  @Delete('me/search-history')
  @ApiOperation({
    summary: '(사용자) 검색 기록 전체 삭제'
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: Boolean, description: '검색 기록 전체 삭제 성공' })
  deleteAllSearchHistory(@Req() req: any) {
    return this.usersService.deleteAllSearchHistory(req.user.userId);
  }
}
