import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('content_reports')
export class ContentReport {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    reporter: User;

    @Column({ type: 'enum', enum: ['certification', 'trade', 'chat', 'store'] })
    targetType: 'certification' | 'trade' | 'chat' | 'store';

    @Column()
    targetId: number;

    @Column({ length: 100, nullable: true })
    reason: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: ['open', 'resolved', 'rejected'], default: 'open' })
    status: 'open' | 'resolved' | 'rejected';

    @CreateDateColumn()
    createdAt: Date;
}