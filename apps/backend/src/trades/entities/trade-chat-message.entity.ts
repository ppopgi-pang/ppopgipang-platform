import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TradeChatRoom } from "./trade-chat-room.entity";
import { User } from "src/users/entities/user.entity";

@Entity('trade_chat_message')
export class TradeChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    sender: User;

    @Column({ type: 'text' })
    message: string;

    @CreateDateColumn({ name: 'sent_at' })
    sentAt: Date;

    @ManyToOne(() => TradeChatRoom, (room) => room.messages)
    room: TradeChatRoom;
}