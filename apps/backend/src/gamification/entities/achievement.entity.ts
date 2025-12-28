import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    code: string; // 예 FIRST_LOOT

    @Column({ length: 100 })
    name: string;

    @Column()
    description: string;

    @Column({ type: 'json', nullable: true })
    conditionJson: any;

    @Column({ nullable: true })
    badgeImageName: string;

    @Column({ default: false})
    isHidden: boolean;
}