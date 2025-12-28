import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certification } from './entities/certification.entity';
import { CertificationPhoto } from './entities/certification-photo.entity';
import { LootLike } from './entities/loot-like.entity';
import { UserStoreStats } from './entities/user-store-stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certification,
      CertificationPhoto,
      LootLike,
      UserStoreStats,
    ])
  ],
})
export class CertificationsModule {}
