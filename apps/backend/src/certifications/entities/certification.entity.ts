import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CertificationPhoto } from "./certification-photo.entity";
import { LootLike } from "./loot-like.entity";
import { LootTag } from "./loot-tag.entity";
import { CheckinReasonPreset } from "./checkin-reason-preset.entity";

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

    @Column({ length: 200, nullable: true })
    comment: string; // 한줄평 (득템용)

    @Column({ type: 'enum', enum: ['good', 'normal', 'bad'], nullable: true })
    rating: 'good' | 'normal' | 'bad'; // 상태 평가 (체크인용)

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

    @OneToMany(() => LootLike, (like) => like.certification)
    likes: LootLike[];

    @ManyToMany(() => LootTag, tag => tag.certifications)
    @JoinTable({
        name: 'certification_tags',
        joinColumn: { name: 'certificationId' },
        inverseJoinColumn: { name: 'tagId' }
    })
    tags: LootTag[];

    @ManyToMany(() => CheckinReasonPreset, reason => reason.certifications)
    @JoinTable({
        name: 'certification_reasons',
        joinColumn: { name: 'certificationId' },
        inverseJoinColumn: { name: 'reasonId' }
    })
    reasons: CheckinReasonPreset[];
}
