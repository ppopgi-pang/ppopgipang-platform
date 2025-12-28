import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity('store_photos')
@Index(['store', 'type'])
export class StorePhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ['cover', 'sign', 'inside', 'roadview'] })
    type: 'cover' | 'sign' | 'inside' | 'roadview';

    @Column({ length: 255 })
    imageName: string;

    @ManyToOne(() => Store, (store) => store.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
}