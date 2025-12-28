import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentReport } from './entities/content-report.entity';
import { ModerationAction } from './entities/moderation-action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContentReport,
      ModerationAction,
    ])
  ],
})
export class ModerationModule {}
