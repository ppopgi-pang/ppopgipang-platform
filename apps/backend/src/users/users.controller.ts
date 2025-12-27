import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
