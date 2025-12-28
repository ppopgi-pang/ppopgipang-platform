import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('notifications')
@Index('idx_noti_user_read', ['user', 'isRead'])
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    type: string; // level_up, trade_msg 등

    @Column({ length: 100 })
    title: string;

    @Column()
    message: string;

    @Column({ type: 'json', nullable: true })
    payload: any; // 클릭 시 경로 이동 등

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;
}
