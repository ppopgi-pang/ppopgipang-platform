import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreType } from './entities/store-type.entity';
import { StoreFacility } from './entities/store-facility.entity';
import { StorePhoto } from './entities/store-photo.entity';
import { StoreOpeningHours } from './entities/store-opening-hours.entity';
import { StoreAnalytics } from './entities/store-analytics.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { UserStoreStats } from './entities/user-store-stats.entity';
import { UsersModule } from 'src/users/users.module';
import { Certification } from 'src/certifications/entities/certification.entity';
import { CertificationPhoto } from 'src/certifications/entities/certification-photo.entity';
import { UserStamp } from 'src/gamification/entities/user-stamp.entity';
import { Stamp } from 'src/gamification/entities/stamp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store,
      StoreType,
      StoreFacility,
      StorePhoto,
      StoreOpeningHours,
      StoreAnalytics,
      Review,
      UserStoreStats,
      Certification,
      CertificationPhoto,
      UserStamp,
      Stamp
    ]),
    UsersModule,
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule { }
