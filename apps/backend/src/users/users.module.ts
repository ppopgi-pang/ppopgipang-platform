import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserLoot } from './entities/user-loot.entity';
import { UserSearchHistory } from './entities/user-search-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserLoot,
      UserSearchHistory,
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
