import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { Like, Repository } from 'typeorm';
import { TradeChatRoom } from './entities/trade-chat-room.entity';
import { TradeChatMessage } from './entities/trade-chat-message.entity';
import { User } from 'src/users/entities/user.entity';
import { TradeInput, TradeResult } from '@ppopgipang/types';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { rename } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

@Injectable()
export class TradesService {
    constructor(
        @InjectRepository(Trade)
        private readonly tradeRepository: Repository<Trade>,
        @InjectRepository(TradeChatRoom)
        private readonly tradeChatRoomRepository: Repository<TradeChatRoom>,
        @InjectRepository(TradeChatMessage)
        private readonly tradeChatMessageRepository: Repository<TradeChatMessage>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async createTrade(userId: number, createTradeDto: TradeInput.CreateTradeDto): Promise<number> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException(`유저를 찾을 수 없습니다. : ${userId}`);
        }

        const trade = this.tradeRepository.create({
            ...createTradeDto,
            user
        });

        if (createTradeDto.images) {
            await this.moveImages(createTradeDto.images);
        }

        return (await this.tradeRepository.save(trade)).id;
    }

    async findOneTrade(id: number): Promise<TradeResult.TradeDetailDto> {
        const trade = await this.tradeRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!trade) {
            throw new NotFoundException(`해당 거래를 찾을 수 없습니다. : ${id}`);
        }

        return new TradeResult.TradeDetailDto(trade);
    }

    async searchTrade(keyword: string, page: number, size: number): Promise<TradeResult.SearchDto> {
        const [trades, total] = await this.tradeRepository.findAndCount({
            where: [
                { title: Like(`%${keyword}%`) },
                { description: Like(`%${keyword}%`) }
            ],
            relations: ['user'],
            take: size,
            skip: (page - 1) * size,
            order: { createdAt: 'DESC' }
        });

        const tradeSummaries = trades.map(trade => new TradeResult.TradeSummaryDto(trade));

        return new TradeResult.SearchDto(true, tradeSummaries, { count: total });
    }

    async updateTrade(id: number, updateTradeDto: TradeInput.UpdateTradeDto): Promise<void> {
        const trade = await this.tradeRepository.findOne({
            where: { id }
        });

        if (!trade) {
            throw new NotFoundException(`해당 거래를 찾을 수 없습니다. : ${id}`);
        }

        if (updateTradeDto.images) {
            await this.moveImages(updateTradeDto.images);
        }

        await this.tradeRepository.update(id, updateTradeDto);
    }

    async deleteTrade(tradeId: number, userId: number): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(`유저를 찾을 수 없습니다. : ${userId}`);
        }

        const trade = await this.tradeRepository.findOne({
            where: { id: tradeId },
            relations: ['user']
        });

        if (!trade) {
            throw new NotFoundException(`해당 거래를 찾을 수 없습니다. : ${tradeId}`);
        }

        if (!user.isAdmin && trade.user.id !== user.id) {
            throw new ForbiddenException('본인의 게시글만 삭제할 수 있습니다.');
        }

        await this.tradeRepository.delete(tradeId);
    }

    private async moveImages(images: string[]) {
        const tempFolder = join(process.cwd(), '../../public', 'temp');
        const tradeFolder = join(process.cwd(), '../../public', 'trade');

        if (!existsSync(tradeFolder)) {
            mkdirSync(tradeFolder, { recursive: true });
        }

        await Promise.all(images.map(async (name) => {
            const oldPath = join(tempFolder, name);
            const newPath = join(tradeFolder, name);

            try {
                // Check if file exists in temp before moving
                // We use existsSync for simplicity as fs/promises doesn't have exists
                if (existsSync(oldPath)) {
                    await rename(oldPath, newPath);
                }
            } catch (e) {
                // Ignore error
                console.error(`Failed to move image ${name}:`, e);
            }
        }));
    }
}
