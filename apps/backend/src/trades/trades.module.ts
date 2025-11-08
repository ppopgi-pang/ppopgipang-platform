import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeBoard } from './entities/trade-board.entity';
import { TradeChatMessage } from './entities/trade-chat-message.entity';
import { TradeChatRoom } from './entities/trade-chat-room.entity';

@Module({imports: [
    TypeOrmModule.forFeature([
      TradeBoard, TradeChatMessage, TradeChatRoom
    ])
  ],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
