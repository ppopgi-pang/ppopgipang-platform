import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";

@Entity('job_postings')
export class JobPosting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 100, nullable: true })
    department?: string;

    @Column({ length: 50, nullable: true })
    positionType?: string;

    @Column({ length: 200, nullable: true })
    location?: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Application, (application) => application.jobPosting)
    applications: Application[];
}
