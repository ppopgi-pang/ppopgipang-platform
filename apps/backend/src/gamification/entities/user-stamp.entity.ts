import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Stamp } from "./stamp.entity";

@Entity('user_stamps')
export class UserStamp {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    stampId: number;

    @Column({ type: 'datetime', precision: 6 })
    acquiredAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Stamp, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'stampId' })
    stamp: Stamp;
}
