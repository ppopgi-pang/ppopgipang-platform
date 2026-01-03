import { Body, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { QueryRunner } from 'typeorm';
import { ProposalsService } from './proposals.service';
import { ProposalInput, ProposalResult } from '@ppopgipang/types';
import { TransactionInterceptor } from 'src/commons/interceptors/transaction.interceptor';
import { InjectQueryRunner } from 'src/commons/decorators/query-runner-decorator';

@Controller('proposals')
@ApiTags('[Proposal] 제보')
@Controller('v1/proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) { }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 신규 제보 생성'
  })
  @ApiBody({ type: ProposalInput.CreateProposalDto })
  @ApiCreatedResponse({ type: ProposalResult.CreateProposalResultDto, description: '신규 제보 생성 성공' })
  createProposal(
    @Req() req: any,
    @Body() dto: ProposalInput.CreateProposalDto,
    @InjectQueryRunner() queryRunner: QueryRunner
  ) {
    return this.proposalsService.createProposal(req.user.userId, queryRunner, dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '(사용자) 내 제보 내역 조회'
  })
  @ApiQuery({ name: 'status', required: false, description: '제보 상태 (pending | approved | rejected)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1 })
  @ApiQuery({ name: 'size', required: false, description: '한번에 가져올 콘텐츠 수', example: 20 })
  @ApiOkResponse({ type: ProposalResult.MyProposalsDto, description: '내 제보 내역 조회 성공' })
  getMyProposals(
    @Req() req: any,
    @Query('status') status?: 'pending' | 'approved' | 'rejected',
    @Query('page') page: number = 1,
    @Query('size') size: number = 20
  ) {
    return this.proposalsService.getMyProposals(req.user.userId, status, page, size);
  }
}
