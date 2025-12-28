import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { PushSubscription } from './entities/push-subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      PushSubscription,
    ])
  ],
})
export class NotificationsModule {}
