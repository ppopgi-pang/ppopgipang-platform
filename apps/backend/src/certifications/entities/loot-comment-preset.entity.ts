import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('loot_comment_presets')
export class LootCommentPreset {
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
}
