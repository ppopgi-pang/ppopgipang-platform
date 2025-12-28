import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Certification } from "src/certifications/entities/certification.entity";

@Entity('user_loots')
export class UserLoot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: true })
    title: string;

    @Column({ length: 50, nullable: true })
    category: string;

    @Column({ type: 'int', nullable: true })
    estimatedPrice: number;

    @Column({ type: 'enum', enum: ['common', 'rare', 'legend'], default: 'common' })
    rarity: 'common' | 'rare' | 'legend';

    @Column({ type: 'float', default: 0 })
    aiConfidence: number;

    @Column({ type: 'enum', enum: ['kept', 'selling', 'sold', 'exchanged'], default: 'kept'})
    status: 'kept' | 'selling' | 'sold' | 'exchanged';

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.loots, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Certification, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'certificationId' })
    certification: Certification;
}