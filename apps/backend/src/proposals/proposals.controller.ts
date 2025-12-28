import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
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
    @Body() dto: ProposalInput.CreateProposalDto
  ) {
    return this.proposalsService.createProposal(req.user.userId, dto);
  }
}
