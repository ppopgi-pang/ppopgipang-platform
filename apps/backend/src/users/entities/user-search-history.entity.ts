import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('user_search_history')
@Index(['user', 'searchedAt'])
export class UserSearchHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    keyword: string;

    @CreateDateColumn()
    searchedAt: Date;

    @ManyToOne(() => User, (user) => user.searchHistories, { onDelete: 'CASCADE' })
    user: User;
}