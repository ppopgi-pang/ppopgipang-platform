import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CertificationPhoto } from "./certification-photo.entity";

@Entity('certifications')
@Index(['store', 'occurredAt'])
@Index(['user', 'occurredAt'])
export class Certification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ['loot', 'checkin']})
    type: 'loot' | 'checkin';

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true})
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true})
    longitude: number;

    @Column()
    exp: number; // 획득 경험치 스냅샷

    @Column({ type: 'datetime', precision: 6 })
    occurredAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Store, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'storeId' })
    store: Store;

    @OneToMany(() => CertificationPhoto, (photo) => photo.certification)
    photos: CertificationPhoto[];
}
