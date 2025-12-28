import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity('store_opening_hours')
export class StoreOpeningHours {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'tinyint', comment: '0=Sun, 1=Mon, ... 6=Sat' })
    dayOfWeek: number;

    @Column({ type: 'time', nullable: true })
    openTime: string;

    @Column({ type: 'time', nullable: true })
    closeTime: string;

    @Column({ default: false })
    isClosed: boolean;

    @ManyToOne(() => Store, (store) => store.openingHours, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store; 
}