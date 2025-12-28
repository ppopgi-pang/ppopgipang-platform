import { User } from "src/users/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Certification } from "./certification.entity";

@Entity('loot_likes')
export class LootLike {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    certificationId: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Certification, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'certificationId' })
    certification: Certification;
}