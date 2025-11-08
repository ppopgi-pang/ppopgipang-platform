import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trade } from "./trade.entity";
import { TradeChatMessage } from "./trade-chat-message.entity";

@Entity('trade_chat_room')
export class TradeChatRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sellerId: number;

    @Column()
    buyerId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Trade, (trade) => trade.chatRooms)
    tradePost: Trade;

    @OneToMany(() => TradeChatMessage, (msg) => msg.room)
    messages: TradeChatMessage[];
}