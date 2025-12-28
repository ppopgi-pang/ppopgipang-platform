import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { User } from 'src/users/entities/user.entity';
import { UserProgress } from 'src/gamification/entities/user-progress.entity';
import { Store } from 'src/stores/entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proposal,
      User,
      UserProgress,
      Store
    ])
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule { }
