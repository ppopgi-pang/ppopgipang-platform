import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trade } from "./trade.entity";

@Entity('trade_board')
export class TradeBoard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @OneToMany(() => Trade, (trade) => trade.board)
    posts: Trade[];
}