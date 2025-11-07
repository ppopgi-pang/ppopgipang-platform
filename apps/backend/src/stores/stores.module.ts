import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreType } from './entities/store-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store, StoreType
    ])
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
