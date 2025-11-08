import { Proposal } from "src/proposals/entities/proposal.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StoreType } from "./store-type.entity";

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, nullable: true })
    address: string;

    @Column('decimal', { precision: 10, scale: 6})
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6 })
    longitude: number;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ type: 'float', default: 0 })
    averageRating: number;

    @OneToMany(() => Review, (review) => review.store)
    reviews: Review[];

    @OneToMany(() => Proposal, (proposal) => proposal.store)
    proposals: Proposal[];

    @ManyToOne(() => StoreType, (storeType) => storeType.stores)
    type: StoreType; 
}