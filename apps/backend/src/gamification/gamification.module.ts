import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Stamp } from './entities/stamp.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserProgress } from './entities/user-progress.entity';
import { UserStamp } from './entities/user-stamp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      Stamp,
      UserAchievement,
      UserProgress,
      UserStamp,
    ])
  ],
})
export class GamificationModule {}
