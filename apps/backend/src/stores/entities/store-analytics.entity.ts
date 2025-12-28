import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity('store_analytics')
export class StoreAnalytics {
    @PrimaryColumn()
    storeId: number // Store ID를 PK이자 FK로 사용

    @Column({ default: 0 })
    congestionScore: number;

    @Column({ default: 50 })
    successProb: number;

    @Column({ default: 0 })
    recentLootCount: number;

    @Column({ type: 'json', nullable: true })
    hotTimeJson: any; // 시간대별 데이터

    @Column({ type: 'datetime', precision: 6, nullable: true })
    lastAnalyzedAt: Date;

    @OneToOne(() => Store, (store) => store.analytics, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
}
