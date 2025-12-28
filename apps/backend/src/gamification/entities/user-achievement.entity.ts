import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Achievement } from "./achievement.entity";

@Entity('user_achievements')
export class UserAchievement {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    achievementId: number;

    @Column()
    earnedAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Achievement, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'achievementId'})
    achievement: Achievement;
}