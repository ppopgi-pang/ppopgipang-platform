import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResult, UserSearchHistory } from '@ppopgipang/types';
import { UserSearchHistory as UserSearchHistoryEntity } from './entities/user-search-history.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserSearchHistoryEntity)
        private readonly searchHistoryRepository: Repository<UserSearchHistoryEntity>
    ) { }

    async getUserInfo(userId: number) {
        const user = await this.userRepository.findOneBy({ 'id': userId });
        if (!user) throw new BadRequestException('요청한 유저가 존재하지 않습니다.');
        const result = new UserResult.UserInfo(user);
        return result;
    }

    async getSearchHistory(userId: number) {
        const histories = await this.searchHistoryRepository.find({
            where: { user: { id: userId } },
            order: { searchedAt: 'DESC' }
        });
        return histories.map(h => new UserSearchHistory.SearchHistoryDto(h.id, h.keyword, h.searchedAt));
    }

    async deleteSearchHistory(userId: number, historyId: number) {
        const history = await this.searchHistoryRepository.findOne({
            where: { id: historyId, user: { id: userId } }
        });
        if (!history) throw new BadRequestException('해당 검색 기록이 존재하지 않습니다.');
        await this.searchHistoryRepository.remove(history);
        return true;
    }

    async deleteAllSearchHistory(userId: number) {
        await this.searchHistoryRepository.delete({ user: { id: userId } });
        return true;
    }

    async addSearchHistory(userId: number, keyword: string) {
        // 중복 제거 후 최신화 로직 (선택사항이지만 UX상 좋음)
        const exist = await this.searchHistoryRepository.findOne({
            where: { user: { id: userId }, keyword }
        });

        if (exist) {
            exist.searchedAt = new Date();
            await this.searchHistoryRepository.save(exist);
        } else {
            const history = this.searchHistoryRepository.create({
                keyword,
                user: { id: userId }
            });
            await this.searchHistoryRepository.save(history);
        }
    }

}
