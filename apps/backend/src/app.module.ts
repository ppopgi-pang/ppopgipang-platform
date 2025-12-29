import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProposalsModule } from './proposals/proposals.module';
import { TradesModule } from './trades/trades.module';
import { User } from './users/entities/user.entity';
import { UserLoot } from './users/entities/user-loot.entity';
import { UserSearchHistory } from './users/entities/user-search-history.entity';
import { Store } from './stores/entities/store.entity';
import { StoreType } from './stores/entities/store-type.entity';
import { StoreFacility } from './stores/entities/store-facility.entity';
import { StorePhoto } from './stores/entities/store-photo.entity';
import { StoreOpeningHours } from './stores/entities/store-opening-hours.entity';
import { StoreAnalytics } from './stores/entities/store-analytics.entity';
import { Review } from './reviews/entities/review.entity';
import { Proposal } from './proposals/entities/proposal.entity';
import { Trade } from './trades/entities/trade.entity';
import { TradeChatMessage } from './trades/entities/trade-chat-message.entity';
import { TradeChatRoom } from './trades/entities/trade-chat-room.entity';
import { Certification } from './certifications/entities/certification.entity';
import { CertificationPhoto } from './certifications/entities/certification-photo.entity';
import { LootLike } from './certifications/entities/loot-like.entity';
import { LootTag } from './certifications/entities/loot-tag.entity';
import { LootCommentPreset } from './certifications/entities/loot-comment-preset.entity';
import { CheckinReasonPreset } from './certifications/entities/checkin-reason-preset.entity';
import { UserStoreStats } from './stores/entities/user-store-stats.entity';
import { Achievement } from './gamification/entities/achievement.entity';
import { Stamp } from './gamification/entities/stamp.entity';
import { UserProgress } from './gamification/entities/user-progress.entity';
import { UserAchievement } from './gamification/entities/user-achievement.entity';
import { UserStamp } from './gamification/entities/user-stamp.entity';
import { ContentReport } from './moderation/entities/content-report.entity';
import { ModerationAction } from './moderation/entities/moderation-action.entity';
import { Notification } from './notifications/entities/notification.entity';
import { PushSubscription } from './notifications/entities/push-subscription.entity';

import { CommonsModule } from './commons/commons.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { IsAdminGuard } from './auth/guards/is-admin.guard';
import { JwtGlobalAuthGuard } from './auth/guards/jwt-global-auth.guard';
import { CertificationsModule } from './certifications/certifications.module';
import { GamificationModule } from './gamification/gamification.module';
import { ModerationModule } from './moderation/moderation.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().valid('dev', 'prod').required(),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_REDIRECT_URI: Joi.string().required(),
        FRONTEND_ORIGIN: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
      })
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ({
        type: ConfigService.getOrThrow<'mysql'>('DB_TYPE'),
        host: ConfigService.getOrThrow<string>('DB_HOST'),
        port: ConfigService.getOrThrow<number>('DB_PORT'),
        username: ConfigService.getOrThrow<string>('DB_USERNAME'),
        password: ConfigService.getOrThrow<string>('DB_PASSWORD'),
        database: ConfigService.getOrThrow<string>('DB_DATABASE'),
        entities: [
          User,
          UserLoot,
          UserSearchHistory,
          Store,
          StoreType,
          StoreFacility,
          StorePhoto,
          StoreOpeningHours,
          StoreAnalytics,
          Review,
          Proposal,
          Trade,
          TradeChatMessage,
          TradeChatRoom,
          Certification,
          CertificationPhoto,
          LootLike,
          LootTag,
          LootCommentPreset,
          CheckinReasonPreset,
          UserStoreStats,
          Achievement,
          Stamp,
          UserProgress,
          UserAchievement,
          UserStamp,
          ContentReport,
          ModerationAction,
          Notification,
          PushSubscription,
        ],
        synchronize: true
      }),
      inject: [ConfigService]
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public/',
    }),

    UsersModule,

    StoresModule,

    ReviewsModule,

    ProposalsModule,

    TradesModule,

    CommonsModule,

    AuthModule,

    CertificationsModule,

    GamificationModule,

    ModerationModule,

    NotificationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGlobalAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: IsAdminGuard,
    }
  ],
})
export class AppModule { }
