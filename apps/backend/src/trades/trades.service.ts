import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { In, Like, Repository } from 'typeorm';
import { TradeChatRoom } from './entities/trade-chat-room.entity';
import { TradeChatMessage } from './entities/trade-chat-message.entity';
import { User } from 'src/users/entities/user.entity';
import { TradeChatInput, TradeChatResult, TradeInput, TradeResult } from '@ppopgipang/types';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { rename } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

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
        private readonly userRepository: Repository<User>,
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

    async findOneTrade(id: number, userId?: number): Promise<TradeResult.TradeDetailDto> {
        const trade = await this.tradeRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!trade) {
            throw new NotFoundException(`해당 거래를 찾을 수 없습니다. : ${id}`);
        }

        let chatRoomExists = false;
        let chatRoomId: number | null = null;

        if (userId) {
            const chatRoom = await this.tradeChatRoomRepository.findOne({
                where: {
                    tradePost: { id },
                    buyerId: userId
                }
            });

            if (chatRoom) {
                chatRoomExists = true;
                chatRoomId = chatRoom.id;
            }
        }

        return new TradeResult.TradeDetailDto(trade, {
            exists: chatRoomExists,
            id: chatRoomId
        });
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
        const tempFolder = join(process.cwd(), 'public', 'temp');
        const tradeFolder = join(process.cwd(), 'public', 'trade');

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

    async createChatRoom(buyerId: number, createDto: TradeChatInput.CreateTradeChatRoomDto): Promise<TradeChatResult.TradeChatRoomDto> {
        const { tradeId } = createDto;
        const trade = await this.tradeRepository.findOne({
            where: { id: tradeId },
            relations: ['user']
        });

        if (!trade) {
            throw new NotFoundException(`해당 거래를 찾을 수 없습니다. : ${tradeId}`);
        }

        const existingChatRoom = await this.tradeChatRoomRepository.findOne({
            where: {
                tradePost: { id: tradeId },
                buyerId
            },
            relations: ['tradePost']
        });

        if (existingChatRoom) {
            const [seller, buyer] = await Promise.all([
                this.userRepository.findOne({ where: { id: existingChatRoom.sellerId } }),
                this.userRepository.findOne({ where: { id: existingChatRoom.buyerId } })
            ]);
            return new TradeChatResult.TradeChatRoomDto(existingChatRoom, { seller, buyer });
        }

        const chatRoom = this.tradeChatRoomRepository.create({
            tradePost: trade,
            sellerId: trade.user.id,
            buyerId
        });

        const buyer = await this.userRepository.findOne({ where: { id: buyerId } });
        const savedChatRoom = await this.tradeChatRoomRepository.save(chatRoom);
        return new TradeChatResult.TradeChatRoomDto(savedChatRoom, { seller: trade.user, buyer });
    }

    async leaveChatRoom(chatRoomId: number, userId: number): Promise<void> {
        const chatRoom = await this.tradeChatRoomRepository.findOne({
            where: { id: chatRoomId }
        });

        if (!chatRoom) {
            throw new NotFoundException(`채팅방을 찾을 수 없습니다. : ${chatRoomId}`);
        }

        // Check if the user is either the seller or the buyer
        if (chatRoom.sellerId !== userId && chatRoom.buyerId !== userId) {
            throw new ForbiddenException('채팅방에 참여한 사용자만 나갈 수 있습니다.');
        }

        // Delete all messages in the chat room first
        await this.tradeChatMessageRepository.delete({ room: { id: chatRoomId } });

        // Delete the chat room
        await this.tradeChatRoomRepository.delete(chatRoomId);
    }

    async createChatMessage(senderId: number, createDto: TradeChatInput.CreateTradeChatMessageDto): Promise<TradeChatResult.TradeChatMessageDto> {
        const { chatRoomId, message } = createDto;

        const chatRoom = await this.tradeChatRoomRepository.findOne({
            where: { id: chatRoomId }
        });

        if (!chatRoom) {
            throw new NotFoundException(`채팅방을 찾을 수 없습니다. : ${chatRoomId}`);
        }

        // Check if the sender is part of the chat room
        if (chatRoom.sellerId !== senderId && chatRoom.buyerId !== senderId) {
            throw new ForbiddenException('채팅방에 참여한 사용자만 메시지를 보낼 수 있습니다.');
        }

        const sender = await this.userRepository.findOne({ where: { id: senderId } });
        if (!sender) {
            throw new NotFoundException(`유저를 찾을 수 없습니다. : ${senderId}`);
        }

        const chatMessage = this.tradeChatMessageRepository.create({
            room: chatRoom,
            sender,
            message
        });

        const savedMessage = await this.tradeChatMessageRepository.save(chatMessage);
        return new TradeChatResult.TradeChatMessageDto(savedMessage);
    }

    async findAllChatMessages(userId: number, chatRoomId: number, page: number, size: number): Promise<TradeChatResult.TradeChatMessageListDto> {
        const chatRoom = await this.tradeChatRoomRepository.findOne({
            where: { id: chatRoomId },
            relations: ['tradePost']
        });

        if (!chatRoom) {
            throw new NotFoundException(`채팅방을 찾을 수 없습니다. : ${chatRoomId}`);
        }

        // Check if the user is either the seller or the buyer
        if (chatRoom.sellerId !== userId && chatRoom.buyerId !== userId) {
            throw new ForbiddenException('채팅방에 참여한 사용자만 메시지를 조회할 수 있습니다.');
        }

        const [messages, total] = await this.tradeChatMessageRepository.findAndCount({
            where: { room: { id: chatRoomId } },
            relations: ['sender', 'room'],
            take: size,
            skip: (page - 1) * size,
            order: { sentAt: 'DESC' }
        });

        const dtos = messages.map(msg => new TradeChatResult.TradeChatMessageDto(msg));
        const userMap = await this.getUsersByIds([chatRoom.sellerId, chatRoom.buyerId]);
        const roomDto = new TradeChatResult.TradeChatRoomDto(chatRoom, {
            seller: userMap.get(chatRoom.sellerId),
            buyer: userMap.get(chatRoom.buyerId)
        });
        return new TradeChatResult.TradeChatMessageListDto(dtos, total, roomDto);
    }

    async getMyTradeChatRooms(userId: number): Promise<TradeChatResult.TradeChatRoomListDto> {
        const chatRooms = await this.tradeChatRoomRepository.find({
            where: [
                { sellerId: userId },
                { buyerId: userId }
            ],
            relations: ['tradePost'],
            order: { createdAt: 'DESC' }
        });

        const userMap = await this.getUsersByIds(chatRooms.flatMap((room) => [room.sellerId, room.buyerId]));
        const roomDtos = await Promise.all(chatRooms.map(async (room) => {
            const lastMessage = await this.tradeChatMessageRepository.findOne({
                where: { room: { id: room.id } },
                relations: ['sender', 'room'],
                order: { sentAt: 'DESC' }
            });

            return new TradeChatResult.TradeChatRoomWithLastMessageDto(
                new TradeChatResult.TradeChatRoomDto(room, {
                    seller: userMap.get(room.sellerId),
                    buyer: userMap.get(room.buyerId)
                }),
                lastMessage ? new TradeChatResult.TradeChatMessageDto(lastMessage) : null
            );
        }));

        return new TradeChatResult.TradeChatRoomListDto(roomDtos, chatRooms.length);
    }

    private async getUsersByIds(userIds: number[]): Promise<Map<number, User>> {
        const uniqueIds = Array.from(new Set(userIds)).filter((id) => typeof id === 'number');
        if (uniqueIds.length === 0) {
            return new Map();
        }

        const users = await this.userRepository.findBy({ id: In(uniqueIds) });
        return new Map(users.map((user) => [user.id, user]));
    }
}
