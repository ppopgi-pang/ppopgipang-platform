import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Certification } from "./certification.entity";

@Entity('loot_tags')
export class LootTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 100, nullable: true })
    iconName: string;

    @Column({ default: 0 })
    sortOrder: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => Certification, cert => cert.tags)
    certifications: Certification[];
}
