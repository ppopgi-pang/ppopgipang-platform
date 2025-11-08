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
import { Store } from './stores/entities/store.entity';
import { StoreType } from './stores/entities/store-type.entity';
import { Review } from './reviews/entities/review.entity';
import { Proposal } from './proposals/entities/proposal.entity';
import { Trade } from './trades/entities/trade.entity';
import { TradeBoard } from './trades/entities/trade-board.entity';
import { TradeChatMessage } from './trades/entities/trade-chat-message.entity';
import { TradeChatRoom } from './trades/entities/trade-chat-room.entity';
import { ReviewBoard } from './reviews/entities/review-board.entity';

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
          User, Store, StoreType, Review, Proposal, Trade,
          TradeBoard, TradeChatMessage, TradeChatRoom,
          ReviewBoard
        ],
        synchronize: true
      }),
      inject: [ConfigService]
    }),

    UsersModule,

    StoresModule,

    ReviewsModule,

    ProposalsModule,

    TradesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
