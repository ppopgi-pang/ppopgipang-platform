import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { Trade } from "./trade.entity";
import { TradeChatMessage } from "./trade-chat-message.entity";
import { User } from "src/users/entities/user.entity";

@Entity('trade_chat_room')
export class TradeChatRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'sellerId' })
    seller: User;

    @RelationId((room: TradeChatRoom) => room.seller)
    sellerId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'buyerId' })
    buyer: User;

    @RelationId((room: TradeChatRoom) => room.buyer)
    buyerId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Trade, (trade) => trade.chatRooms, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'tradeId' })
    tradePost: Trade;

    @OneToMany(() => TradeChatMessage, (msg) => msg.room)
    messages: TradeChatMessage[];
}
