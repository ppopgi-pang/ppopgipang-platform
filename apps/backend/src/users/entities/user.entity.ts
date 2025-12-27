import { Proposal } from "src/proposals/entities/proposal.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Trade } from "src/trades/entities/trade.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    email: string;

    @Column({ nullable: true })
    kakaoId: string;

    @Column({ length: 30 })
    nickname: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ type: 'varchar', nullable: true })
    refreshToken?: string;

    @Column({ type: 'varchar', nullable: true })
    adminPassword: string;

    @OneToMany(() => Review, (reviews) => reviews.user)
    reviews: Review[];

    @OneToMany(() => Proposal, (proposal) => proposal.user)
    proposals: Proposal[];

    @OneToMany(() => Trade, (trade) => trade.user)
    trades: Trade[];

}