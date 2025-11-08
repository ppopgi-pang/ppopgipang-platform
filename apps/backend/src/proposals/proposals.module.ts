import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Proposal
      ])
    ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}
