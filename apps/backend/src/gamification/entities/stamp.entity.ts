import { Store } from "src/stores/entities/store.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('stamps')
export class Stamp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: true })
    imageName: string; // 가게 로고 혹은 지역 심볼

    @ManyToOne(() => Store, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
}