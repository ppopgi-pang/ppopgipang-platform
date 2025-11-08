import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReviewBoard } from "./review-board.entity";

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    rating: number;
    
    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'json', nullable: true })
    images: string[];

    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @ManyToOne(() => Store, (store) => store.reviews)
    store: Store;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => ReviewBoard, (board) => board.posts)
    board: ReviewBoard;
}