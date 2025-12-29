import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certification } from './entities/certification.entity';
import { CertificationPhoto } from './entities/certification-photo.entity';
import { LootLike } from './entities/loot-like.entity';
import { LootTag } from './entities/loot-tag.entity';
import { LootCommentPreset } from './entities/loot-comment-preset.entity';
import { CheckinReasonPreset } from './entities/checkin-reason-preset.entity';
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';
import { User } from 'src/users/entities/user.entity';
import { GamificationModule } from 'src/gamification/gamification.module';
import { UserStoreStats } from 'src/stores/entities/user-store-stats.entity';
import { UserProgress } from 'src/gamification/entities/user-progress.entity';
import { UserStamp } from 'src/gamification/entities/user-stamp.entity';
import { Stamp } from 'src/gamification/entities/stamp.entity';
import { Store } from 'src/stores/entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certification,
      CertificationPhoto,
      LootLike,
      LootTag,
      LootCommentPreset,
      CheckinReasonPreset,
      User,
      UserStoreStats,
      UserProgress,
      UserStamp,
      Stamp,
      Store
    ]),
    GamificationModule
  ],
  controllers: [CertificationsController],
  providers: [CertificationsService],
})
export class CertificationsModule { }
