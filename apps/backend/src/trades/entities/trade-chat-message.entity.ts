import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TradeChatRoom } from "./trade-chat-room.entity";

@Entity('trade_chat_message')
export class TradeChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

    @Column({ type: 'text' })
    message: string;

    @CreateDateColumn({ name: 'sent_at' })
    sentAt: Date;

    @ManyToOne(() => TradeChatRoom, (room) => room.messages)
    room: TradeChatRoom;
}