import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeChatMessage } from './entities/trade-chat-message.entity';
import { TradeChatRoom } from './entities/trade-chat-room.entity';
import { Trade } from './entities/trade.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradeChatMessage, TradeChatRoom, Trade, User
    ])
  ],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule { }
