import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('push_subscriptions')
export class PushSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ['web', 'android', 'ios'] })
    platform: 'web' | 'android' | 'ios';

    @Column({ length: 500 })
    endpoint: string;

    @Column({ length: 255, nullable: true })
    authKey: string;

    @Column({ length: 255, nullable: true })
    p256dhKey: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}