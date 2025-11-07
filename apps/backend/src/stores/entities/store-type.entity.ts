import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity('store_type')
export class StoreType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @OneToMany(() => Store, (store) => store.type)
    stores: Store[];
}