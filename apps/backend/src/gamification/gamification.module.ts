import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Stamp } from './entities/stamp.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserProgress } from './entities/user-progress.entity';
import { UserStamp } from './entities/user-stamp.entity';
import { QuestService } from './quest.service';
import { GamificationService } from './gamification.service';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { Certification } from 'src/certifications/entities/certification.entity';
import { UserStoreStats } from 'src/stores/entities/user-store-stats.entity';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import { CertificationPhoto } from 'src/certifications/entities/certification-photo.entity';
import { LootTag } from 'src/certifications/entities/loot-tag.entity';
import { UserLoot } from 'src/users/entities/user-loot.entity';
import { Trade } from 'src/trades/entities/trade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      Stamp,
      UserAchievement,
      UserProgress,
      UserStamp,
      Certification,
      UserStoreStats,
      Store,
      User,
      CertificationPhoto,
      LootTag,
      UserLoot,
      Trade
    ])
  ],
  controllers: [CollectionsController],
  providers: [QuestService, GamificationService, CollectionsService],
  exports: [QuestService, GamificationService],
})
export class GamificationModule {}
