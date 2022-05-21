import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type_1: string;

    @Column({ nullable: true })
    type_2: string;

    @Column()
    speed: number;
}
