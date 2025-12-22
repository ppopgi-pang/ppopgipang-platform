import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TradeChatRoom } from "./trade-chat-room.entity";

@Entity('trades')
export class Trade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'json', nullable: true })
    images: string[];

    @Column({ type: 'int', nullable: true })
    price: number;

    @Column({ type: 'enum', enum: ['sale', 'exchange'], default: 'sale' })
    type: 'sale' | 'exchange';

    @Column({ type: 'enum', enum: ['active', 'completed', 'cancelled'], default: 'active' })
    status: 'active' | 'completed' | 'cancelled';

    @ManyToOne(() => User, (user) => user.trades)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TradeChatRoom, (room) => room.tradePost)
    chatRooms: TradeChatRoom[];

}
