import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Certification } from "./certification.entity";

@Entity('checkin_reason_presets')
export class CheckinReasonPreset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    content: string;

    @Column({ default: 0 })
    sortOrder: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => Certification, cert => cert.reasons)
    certifications: Certification[];
}
