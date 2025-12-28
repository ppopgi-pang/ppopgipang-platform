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

    @Column({ nullable: true })
    lastVisitedAt: Date;

    @Column({ type: 'enum', enum: ['unknown', 'visited', 'master'], default: 'unknown' })
    tier: 'unknown' | 'visited' | 'master';

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Store, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
}