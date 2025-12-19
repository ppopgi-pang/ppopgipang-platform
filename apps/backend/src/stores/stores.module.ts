import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreType } from './entities/store-type.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store, StoreType, Review
    ])
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
