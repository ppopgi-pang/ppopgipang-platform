import { Proposal } from "src/proposals/entities/proposal.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StoreType } from "./store-type.entity";
import { StoreAnalytics } from "./store-analytics.entity";
import { StoreFacility } from "./store-facility.entity";
import { StoreOpeningHours } from "./store-opening-hours.entity";
import { StorePhoto } from "./store-photo.entity";
import { UserStoreStats } from "./user-store-stats.entity";

@Entity('stores')
@Index('idx_store_region', ['region1', 'region2'])
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, nullable: true })
    address: string;

    @Column('decimal', { precision: 10, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6 })
    longitude: number;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ type: 'float', default: 0 })
    averageRating: number;

    @Column({ length: 50, nullable: true })
    region1: string; // 시/도

    @Column({ length: 50, nullable: true })
    region2: string; // 구/군

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.store)
    reviews: Review[];

    @OneToMany(() => Proposal, (proposal) => proposal.store)
    proposals: Proposal[];

    @ManyToOne(() => StoreType, (storeType) => storeType.stores, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'typeId' })
    type: StoreType;

    @OneToOne(() => StoreAnalytics, (analytics) => analytics.store, { cascade: true })
    analytics: StoreAnalytics;

    @OneToOne(() => StoreFacility, (facility) => facility.store, { cascade: true })
    facilities: StoreFacility;

    @OneToMany(() => StorePhoto, (photo) => photo.store)
    photos: StorePhoto[];

    @OneToMany(() => StoreOpeningHours, (hours) => hours.store)
    openingHours: StoreOpeningHours[];

    @OneToMany(() => UserStoreStats, (stats) => stats.store)
    userStats: UserStoreStats[];
}
