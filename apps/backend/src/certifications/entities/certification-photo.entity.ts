import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Certification } from "./certification.entity";

@Entity('certification_photos')
export class CertificationPhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    imageName: string;

    @Column({ default: 0 })
    sortOrder: number;

    @ManyToOne(() => Certification, (certification) => certification.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'certificationId' })
    certification: Certification;
}