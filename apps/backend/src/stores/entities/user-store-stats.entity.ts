import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('user_store_stats')
export class UserStoreStats {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    storeId: number;

    @Column({ default: 0 })
    visitCount: number;

    @Column({ default: 0 })
    lootCount: number;

    @Column({ type: 'datetime', precision: 6, nullable: true })
    lastVisitedAt: Date;

    @Column({ default: false })
    isScrapped: boolean;

    @Column({ type: 'enum', enum: ['unknown', 'visited', 'master'], default: 'unknown' })
    tier: 'unknown' | 'visited' | 'master';

    @ManyToOne(() => User, (user) => user.storeStats, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Store, (store) => store.userStats, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
}
