import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { ProposalInput } from '@ppopgipang/types';

@Controller('proposals')
@ApiTags('[Proposal] 제보')
@Controller('v1/proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '(사용자) 신규 제보 생성'
  })
  createProposal(
    @Req() req: any,
    @Body() dto: any // using any because ProposalInput might not be detected yet or strict typing check. Actually explicit is better if available.
  ) {
    // dto casting
    return this.proposalsService.createProposal(req.user.userId, dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '(사용자) 내 제보 내역 조회'
  })
  @ApiQuery({ name: 'status', required: false, description: '제보 상태 (pending | approved | rejected)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1 })
  @ApiQuery({ name: 'size', required: false, description: '한번에 가져올 콘텐츠 수', example: 20 })
  getMyProposals(
    @Req() req: any,
    @Query('status') status?: 'pending' | 'approved' | 'rejected',
    @Query('page') page: number = 1,
    @Query('size') size: number = 20
  ) {
    return this.proposalsService.getMyProposals(req.user.userId, status, page, size);
  }
}
