import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContentReport } from "./content-report.entity";
import { User } from "src/users/entities/user.entity";

@Entity('moderation_actions')
export class ModerationAction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: true })
    action: string; // 'ban_user', 'delete_content' 등

    @Column({ type: 'text', nullable: true })
    note: string; // 조치 사유 메모

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => ContentReport, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reportId' })
    report: ContentReport;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'adminId' })
    admin: User;
}