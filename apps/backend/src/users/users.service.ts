import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResult } from '@ppopgipang/types';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async getUserInfo(userId: number) {
        const user = await this.userRepository.findOneBy({ 'id': userId });
        if (!user) throw new BadRequestException('요청한 유저가 존재하지 않습니다.');
        const result = new UserResult.UserInfo(user);
        return result;
    }
}
