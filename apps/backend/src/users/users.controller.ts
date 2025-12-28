import { Controller, Get, Req, UseGuards, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({
    summary: '(사용자) 사용자 정보 조회'
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  getUserInfo(@Req() req: any) {
    return this.usersService.getUserInfo(req.user.userId);
  }

  @Get('me/search-history')
  @ApiOperation({
    summary: '(사용자) 내 최근 검색어 조회'
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  getSearchHistory(@Req() req: any) {
    return this.usersService.getSearchHistory(req.user.userId);
  }

  @Delete('me/search-history/:id')
  @ApiOperation({
    summary: '(사용자) 특정 검색 기록 삭제'
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
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
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  deleteAllSearchHistory(@Req() req: any) {
    return this.usersService.deleteAllSearchHistory(req.user.userId);
  }
}
