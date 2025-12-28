import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('user_progress')
export class UserProgress {
    @PrimaryColumn()
    userId: number;

    @Column({ default: 1 })
    level: number;

    @Column({ default: 0 })
    exp: number; // 스냅샷

    @Column({ default: 0 })
    streakDays: number;

    @Column({ type: 'datetime', precision: 6, nullable: true })
    lastActivityAt: Date;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
