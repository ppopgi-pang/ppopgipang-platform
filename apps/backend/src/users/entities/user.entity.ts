import { Proposal } from "src/proposals/entities/proposal.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Trade } from "src/trades/entities/trade.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserLoot } from "./user-loot.entity";
import { UserSearchHistory } from "./user-search-history.entity";
import { UserStoreStats } from "src/stores/entities/user-store-stats.entity";



@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    email: string;

    @Column({ length: 255, nullable: true, unique: true })
    kakaoId: string;

    @Column({ length: 30 })
    nickname: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refreshToken?: string;

    @Column({ type: 'varchar', nullable: true })
    adminPassword: string;

    @Column({ type: 'decimal', precision: 4, scale: 1, default: 36.5 })
    mannerTemp: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (reviews) => reviews.user)
    reviews: Review[];

    @OneToMany(() => Proposal, (proposal) => proposal.user)
    proposals: Proposal[];

    @OneToMany(() => Trade, (trade) => trade.user)
    trades: Trade[];

    @OneToMany(() => UserLoot, (loot) => loot.user)
    loots: UserLoot[];

    @OneToMany(() => UserSearchHistory, (history) => history.user)
    searchHistories: UserSearchHistory[];

    @OneToMany(() => UserStoreStats, (stats) => stats.user)
    storeStats: UserStoreStats[];

}
