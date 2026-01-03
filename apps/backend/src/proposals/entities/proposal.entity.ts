import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('proposals')
export class Proposal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 255, nullable: true })
    address: string;

    @Column('decimal', { precision: 10, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6 })
    longitude: number;

    @Column({ type: 'json', nullable: true })
    images: string[];

    @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    status: 'pending' | 'approved' | 'rejected';
    
    @ManyToOne(() => User, (user) => user.proposals, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Store, (store) => store.proposals, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'storeId' })
    store: Store;

    @CreateDateColumn()
    createdAt: Date;
}
