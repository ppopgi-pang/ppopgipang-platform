import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity('store_facilities')
export class StoreFacility {
    @PrimaryColumn()
    storeId: number;

    @Column({ nullable: true })
    machineCount: number;

    @Column({ type: 'json', nullable: true })
    paymentMethods: string[]; // ['cash', 'card', 'qr']

    @Column({ nullable: true })
    notes: string;

    @OneToOne(() => Store, (store) => store.facilities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
}