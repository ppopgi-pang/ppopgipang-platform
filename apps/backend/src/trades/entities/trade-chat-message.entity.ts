import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TradeChatRoom } from "./trade-chat-room.entity";
import { User } from "src/users/entities/user.entity";

@Entity('trade_chat_message')
export class TradeChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column({ type: 'text' })
    message: string;

    @Column({ length: 255, nullable: true })
    imageName: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    sentAt: Date;

    @ManyToOne(() => TradeChatRoom, (room) => room.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roomId' })
    room: TradeChatRoom;
}
