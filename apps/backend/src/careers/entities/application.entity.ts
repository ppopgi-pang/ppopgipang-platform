import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { JobPosting } from "./job-posting.entity";

@Entity('applications')
@Index('idx_applications_job_posting', ['jobPosting'])
@Index('idx_applications_status', ['status'])
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobPosting_id' })
    jobPosting: JobPosting;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 200 })
    email: string;

    @Column({ length: 20, nullable: true })
    phone?: string;

    @Column({ length: 500, nullable: true })
    resumeName?: string;

    @Column({ type: 'text', nullable: true })
    memo?: string;

    @Column({ length: 20, default: 'new' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
